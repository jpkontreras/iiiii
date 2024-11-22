<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;

class OCRTask extends Model
{

    /** @use HasFactory<\Database\Factories\OCRTaskFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'ocr_tasks';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'file_path',
        'status',
        'result',
        'error',
        'processing_started_at'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'result' => 'array',
        'processing_started_at' => 'datetime',
    ];

    /**
     * Status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    /**
     * Get valid statuses
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_COMPLETED,
            self::STATUS_FAILED,
        ];
    }

    /**
     * Get the user that owns the OCR task.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include pending tasks.
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope a query to only include processing tasks.
     */
    public function scopeProcessing(Builder $query): void
    {
        $query->where('status', self::STATUS_PROCESSING);
    }

    /**
     * Scope a query to only include completed tasks.
     */
    public function scopeCompleted(Builder $query): void
    {
        $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope a query to only include failed tasks.
     */
    public function scopeFailed(Builder $query): void
    {
        $query->where('status', self::STATUS_FAILED);
    }

    /**
     * Scope a query to only include stalled tasks.
     */
    public function scopeStalled(Builder $query): void
    {
        $query->where('status', self::STATUS_PROCESSING)
            ->where('processing_started_at', '<', now()->subMinutes(5));
    }

    /**
     * Check if the task is pending
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if the task is processing
     */
    public function isProcessing(): bool
    {
        return $this->status === self::STATUS_PROCESSING;
    }

    /**
     * Check if the task is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if the task failed
     */
    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Check if the task is stalled
     */
    public function isStalled(): bool
    {
        return $this->isProcessing() &&
            $this->processing_started_at &&
            $this->processing_started_at->isBefore(now()->subMinutes(5));
    }

    /**
     * Mark task as processing
     */
    public function markAsProcessing(): bool
    {
        return $this->update([
            'status' => self::STATUS_PROCESSING,
            'processing_started_at' => now(),
            'error' => null
        ]);
    }

    /**
     * Mark task as completed
     */
    public function markAsCompleted(array $result): bool
    {
        return $this->update([
            'status' => self::STATUS_COMPLETED,
            'result' => $result,
            'error' => null
        ]);
    }

    /**
     * Mark task as failed
     */
    public function markAsFailed(string $error): bool
    {
        return $this->update([
            'status' => self::STATUS_FAILED,
            'error' => $error,
            'result' => null
        ]);
    }

    /**
     * Get text content from OCR result
     */
    public function getTextContent(): string
    {
        if (!$this->isCompleted() || empty($this->result)) {
            return '';
        }

        return collect($this->result)
            ->pluck('text')
            ->filter()
            ->join(' ');
    }
}

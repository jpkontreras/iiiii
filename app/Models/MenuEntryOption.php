<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MenuEntryOption extends Model
{
  protected $fillable = [
    'menu_entry_id',
    'menu_option_type_id',
    'is_required',
    'order'
  ];

  protected $casts = [
    'is_required' => 'boolean',
    'order' => 'integer'
  ];

  public function entry(): BelongsTo
  {
    return $this->belongsTo(MenuEntry::class, 'menu_entry_id');
  }

  public function optionType(): BelongsTo
  {
    return $this->belongsTo(MenuOptionType::class, 'menu_option_type_id');
  }
}

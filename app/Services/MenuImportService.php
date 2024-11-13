<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Spatie\PdfToText\Pdf;

final class MenuImportService
{
  private const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
  private const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
  private const ALLOWED_SPREADSHEET_TYPES = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ];

  /**
   * Process the uploaded file and create menu items
   */
  public function processFile(Menu $menu, UploadedFile $file): void
  {
    try {
      $mimeType = $file->getMimeType();
      $extension = strtolower($file->getClientOriginalExtension());
      $path = $file->store('temp');

      if (in_array($mimeType, self::ALLOWED_IMAGE_TYPES)) {
        $this->processImage($menu, $path);
      } elseif (in_array($mimeType, self::ALLOWED_DOCUMENT_TYPES)) {
        $this->processPdf($menu, $path);
      } elseif (in_array($mimeType, self::ALLOWED_SPREADSHEET_TYPES) || $extension === 'csv') {
        $this->processSpreadsheet($menu, $path, $extension);
      } else {
        throw new Exception('Unsupported file type: ' . $mimeType);
      }

      // Clean up the temporary file
      Storage::delete($path);
    } catch (Exception $e) {
      Log::error('Menu import failed', [
        'menu_id' => $menu->id,
        'file_name' => $file->getClientOriginalName(),
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);
      throw $e;
    }
  }

  /**
   * Process image file using OCR
   * TODO: Implement actual OCR logic using a service like Google Cloud Vision or Tesseract
   */
  private function processImage(Menu $menu, string $path): void
  {
    // TODO: Implement OCR processing
    // 1. Use OCR service to extract text
    // 2. Parse the text to identify menu items
    // 3. Create menu items with extracted data
    throw new Exception('Image OCR processing not implemented yet');
  }

  /**
   * Process PDF file
   * TODO: Implement PDF text extraction and processing
   */
  private function processPdf(Menu $menu, string $path): void
  {
    // TODO: Implement PDF processing
    // 1. Extract text from PDF
    // 2. Parse text to identify menu items
    // 3. Create menu items with extracted data
    throw new Exception('PDF processing not implemented yet');
  }

  /**
   * Process Excel/CSV file
   */
  private function processSpreadsheet(Menu $menu, string $path, string $extension): void
  {
    $fullPath = Storage::path($path);
    $spreadsheet = IOFactory::load($fullPath);
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = $worksheet->toArray();

    // Remove header row
    $headers = array_shift($rows);
    $this->validateSpreadsheetHeaders($headers);

    $headerMap = $this->mapSpreadsheetHeaders($headers);

    foreach ($rows as $row) {
      if ($this->isEmptyRow($row)) {
        continue;
      }

      $itemData = $this->mapRowToItemData($row, $headerMap);

      if (isset($itemData['category'])) {
        $category = Category::firstOrCreate(
          ['name' => $itemData['category']],
          ['description' => 'Imported category']
        );
        $itemData['category_id'] = $category->id;
        unset($itemData['category']);
      }

      $this->createMenuItem($menu, $itemData);
    }
  }

  /**
   * Validate spreadsheet headers
   */
  private function validateSpreadsheetHeaders(array $headers): void
  {
    $requiredHeaders = ['name', 'price'];
    $foundHeaders = array_map('strtolower', array_map('trim', $headers));

    foreach ($requiredHeaders as $required) {
      if (!in_array($required, $foundHeaders)) {
        throw new Exception("Required column '{$required}' not found in spreadsheet");
      }
    }
  }

  /**
   * Map spreadsheet headers to our expected fields
   */
  private function mapSpreadsheetHeaders(array $headers): array
  {
    $map = [];
    foreach ($headers as $index => $header) {
      $header = strtolower(trim($header));
      switch ($header) {
        case 'name':
        case 'item name':
        case 'product name':
          $map['name'] = $index;
          break;
        case 'price':
        case 'amount':
        case 'cost':
          $map['price'] = $index;
          break;
        case 'description':
        case 'desc':
          $map['description'] = $index;
          break;
        case 'category':
        case 'section':
          $map['category'] = $index;
          break;
        case 'available':
        case 'is available':
        case 'status':
          $map['is_available'] = $index;
          break;
      }
    }
    return $map;
  }

  /**
   * Check if a row is empty
   */
  private function isEmptyRow(array $row): bool
  {
    return empty(array_filter($row, fn($value) => !empty(trim((string) $value))));
  }

  /**
   * Map a spreadsheet row to menu item data
   */
  private function mapRowToItemData(array $row, array $headerMap): array
  {
    $data = [
      'name' => trim((string) $row[$headerMap['name']]),
      'price' => (float) $row[$headerMap['price']],
      'is_available' => true,
    ];

    if (isset($headerMap['description'])) {
      $data['description'] = trim((string) $row[$headerMap['description']]);
    }

    if (isset($headerMap['category'])) {
      $data['category'] = trim((string) $row[$headerMap['category']]);
    }

    if (isset($headerMap['is_available'])) {
      $value = strtolower(trim((string) $row[$headerMap['is_available']]));
      $data['is_available'] = in_array($value, ['yes', 'true', '1', 'available']);
    }

    return $data;
  }

  /**
   * Create a menu item from the extracted data
   */
  private function createMenuItem(Menu $menu, array $data): MenuItem
  {
    return $menu->menuItems()->create([
      'name' => $data['name'],
      'description' => $data['description'] ?? null,
      'price' => $data['price'],
      'category_id' => $data['category_id'] ?? null,
      'is_available' => $data['is_available'] ?? true,
    ]);
  }
}

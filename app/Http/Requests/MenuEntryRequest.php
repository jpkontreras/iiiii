<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class MenuEntryRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'price' => ['nullable', 'numeric', 'min:0'],
      'menu_id' => ['required', 'exists:menus,id'],
      'parent_id' => ['nullable', 'exists:menu_entries,id'],
      'properties' => ['nullable', 'array'],
      'photo_path' => ['nullable', 'string'],
      'is_available' => ['boolean'],
      'order' => ['integer']
    ];
  }
}

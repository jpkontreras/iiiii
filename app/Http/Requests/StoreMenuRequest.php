<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreMenuRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true; // We'll handle authorization through policies later
  }

  public function rules(): array
  {
    return [
      'name' => [
        'required',
        'string',
        'max:255',
        Rule::unique('menus')->where(function ($query) {
          return $query->where('restaurant_id', $this->route('restaurant')->id);
        })
      ],
      'description' => 'nullable|string',
      'is_active' => 'boolean',
    ];
  }

  public function messages(): array
  {
    return [
      'name.unique' => 'A menu with this name already exists in this restaurant.',
    ];
  }
}

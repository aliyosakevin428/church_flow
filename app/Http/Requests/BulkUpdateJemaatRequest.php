<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateJemaatRequest extends FormRequest
{
    /**
     * Determine if the jemaat is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jemaat_ids' => 'required|array',
            'jemaat_ids.*' => 'exists:jemaats,id',
        ];
    }
}

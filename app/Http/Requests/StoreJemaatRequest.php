<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJemaatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'nullable',
            'komunitas_id' => 'nullable|exists:communities,id',

            'name' => 'required|string|max:255',
            'tanggal_lahir' => 'nullable|date',

            'no_hp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ];
    }
}

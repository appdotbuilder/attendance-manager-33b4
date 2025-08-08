<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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
            'qr_data' => 'required|string',
            'action' => 'required|in:clock_in,clock_out',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'qr_data.required' => 'QR code data is required.',
            'action.required' => 'Clock action is required.',
            'action.in' => 'Invalid clock action. Must be clock_in or clock_out.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}
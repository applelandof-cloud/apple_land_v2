<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

class DuplicateEntryException extends HttpException
{
    public function __construct(
        string $message = "El registro ya existe.",
        int $statusCode = 409
    )
    {
        parent::__construct($statusCode, $message);
    }
}

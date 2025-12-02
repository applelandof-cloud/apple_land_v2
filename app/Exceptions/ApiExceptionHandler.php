<?php

namespace App\Exceptions;

use App\Exceptions\DuplicateEntryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;

use Throwable;

class ApiExceptionHandler
{
    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     */
    public static function render(Throwable $exception, Request $request)
    {
        if ($request->is('api/*') || $request->wantsJson()) {
            if ($exception instanceof QueryException) {

                $sqlState   = $exception->errorInfo[0];
                $driverCode = $exception->errorInfo[1];

                $isDuplicate = ($sqlState === "23000" && $driverCode == 1062);

                if ($isDuplicate) {
                    throw new DuplicateEntryException();
                }

                Log::channel('db_errors')->error('Database QueryException', [
                    'message'  => $exception->getMessage(),
                    'sql'      => $exception->getSql(),
                    'bindings' => $exception->getBindings(),
                    'file'     => $exception->getFile(),
                    'line'     => $exception->getLine(),
                ]);

                return response()->json([
                    'message' => 'Error al procesar la solicitud en la base de datos.',
                    'error'   => 'DATABASE_ERROR'
                ], 500);
            }

            if ($exception instanceof ModelNotFoundException) {

                Log::error('ModelNotFoundException: ' . $exception->getMessage());

                return response()->json([
                    'message' => 'Recurso no encontrado.',
                    'error'   => 'MODEL_NOT_FOUND'
                ], 404);
            }

            if ($exception instanceof NotFoundHttpException) {

                Log::error('NotFoundHttpException: ' . $exception->getMessage());

                return response()->json([
                    'message' => 'Recurso no encontrado.',
                    'error'   => 'HTTP_NOT_FOUND'
                ], 404);
            }

            if ($exception instanceof HttpException) {

                Log::error('HttpException: ' . $exception->getMessage());

                return response()->json([
                    'message' => $exception->getMessage() ?: 'Error en la solicitud.',
                    'error'   => class_basename($exception),
                ], $exception->getStatusCode());
            }
        }
    }
}
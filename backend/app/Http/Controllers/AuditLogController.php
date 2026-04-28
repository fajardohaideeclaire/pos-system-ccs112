<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Log;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Restore with('user') so the frontend can display 'log.user.name'
            // Using 'user:id,name' optimizes by only selecting necessary columns
            $query = AuditLog::with(['user:id,name'])
                ->orderBy('created_at', 'desc');

            // Module filter - changed to 'LIKE' for better search experience
            if ($request->filled('module')) {
                $query->where('module', 'LIKE', '%' . $request->module . '%');
            }

            if ($request->filled('action')) {
                $query->where('action', $request->action);
            }

            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            // Date filtering
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Paginate results (default 50 matches your current setup)
            return response()->json($query->paginate(50));

        } catch (\Throwable $e) {
            // Log the error internally for the developer
            Log::error("Audit Log Retrieval Error: " . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve audit logs.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
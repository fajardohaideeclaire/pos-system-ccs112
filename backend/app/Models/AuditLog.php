<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'audit_logs'; // force correct table
    protected $guarded = []; // allow all fields
}
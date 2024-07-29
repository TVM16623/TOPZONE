<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class TestJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        info("Cron Job running at " . now());
        $user = User::find(3);
        $user->name = $user->name . "ok";
        $user->save();
    }
}

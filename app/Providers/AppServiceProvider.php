<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Exception;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
      try {
          if(!session('version'))
          {
              session()->put('version', scandir('.git/refs/tags/', SCANDIR_SORT_DESCENDING)[0] );
          }
      } catch (Exception $e) {
         session()->put('version','code:3');
      }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}

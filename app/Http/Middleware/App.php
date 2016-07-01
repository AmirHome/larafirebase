<?php 
namespace App\Http\Middleware;
use Closure, Session;
class App {
    /**
     * The availables languages.
     *
     * @array $languages
     */
    // protected $languages = ['en','tr'];
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!session('locale'))
        {
            session()->put('locale', \Config::get('app.locale'));
        }
        app()->setLocale(session('locale'));
        return $next($request);
    }
}
# Laravel PHP Framework

[![Latest Stable Version](https://poser.pugx.org/laravel/framework/v/stable.svg)](https://packagist.org/packages/laravel/framework)
[![License](https://poser.pugx.org/laravel/framework/license.svg)](https://packagist.org/packages/laravel/framework)

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as authentication, routing, sessions, queueing, and caching.

## Instaled Composers



## License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).

### Amir Composer
Note **: don't composer update

	composer create-project --prefer-dist laravel/laravel amir-project

### After Clone
1. Update .env, set Database name
2. php artisan key:generate

cd amir-project

	1.
	** composer require laraveldaily/quickadmin
		insert `Laraveldaily\Quickadmin\QuickadminServiceProvider::class,` to your `\config\app.php` providers **after `App\Providers\RouteServiceProvider::class,`** otherwise you will not be able to add new ones to freshly generated controllers.

		php artisan quickadmin:install
		insert App/Http/Kernel.php in the $routeMiddleware: 'role' => \Laraveldaily\Quickadmin\Middleware\HasPermissions::class,

	2.
	** composer require bestmomo/filemanager
        //info: https://github.com/bestmomo/filemanager
        insert config/app.php in the $providers: Bestmomo\Filemanager\FilemanagerServiceProvider::class,
        php artisan vendor:publish
        *****Code******
        USER model
			public function accessMediasAll()
			{
			    // return true for access to all medias
			}

			public function accessMediasFolder()
			{
			    // return true for access to one folder
			}

		public\ckeditor\config.js:     
     	
    		config.filebrowserBrowseUrl= 'http://localhost/cms/public/filemanager/index.html';		
		***********
	3,4.	
	composer require intervention/image
    composer require intervention/imagecache
		php artisan vendor:publish
		insert config/app.php in the $providers: 'Intervention\Image\ImageServiceProvider',
		insert config/app.php in the alias: 'Image'     => 'Intervention\Image\Facades\Image',
		note: the requested PHP extension fileinfo
		*******Code*******
		Route::get('/photo/{size}/{name}', function ($size = null, $name = null) {
			if (!is_null($size) && !is_null($name)) {
				$size        = explode('x', $size);
				$cache_image = Image::cache(function ($image) use ($size, $name) {
				    return $image->make(url('/photos/' . $name))->resize($size[0], $size[1]);
				}, env('CACHE_PHOTO_MINUTE')); // cache for 10 minutes

				return Response::make($cache_image, 200, ['Content-Type' =>'image']);
			} else {
				abort(404);
			}
		});
		// for test <img src="{{ url('/photo/100x100/somephoto.jpg') }}">
		**************
	5.
	composer require felixkiss/uniquewith-validator:2.*
		//info: https://github.com/felixkiss/uniquewith-validator
		insert config/app.php in the $providers: 'Felixkiss\UniqueWithValidator\UniqueWithValidatorServiceProvider',
	6.
    composer require greggilbert/recaptcha:dev-master
        //info: https://github.com/greggilbert/recaptcha
        insert config/app.php in the $providers: Greggilbert\Recaptcha\RecaptchaServiceProvider::class,
        insert config/app.php in the alias     : 'Recaptcha' => Greggilbert\Recaptcha\Facades\Recaptcha::class,
        php artisan vendor:publish --provider="Greggilbert\Recaptcha\RecaptchaServiceProvider"
        /config/recaptcha.php, enter your reCAPTCHA public and private keys.
        resources/lang/[lang]/validation.php: "recaptcha" => 'The :attribute field is not correct.',
	7.
	composer require barryvdh/laravel-debugbar
		insert config/app.php in the $providers: Barryvdh\Debugbar\ServiceProvider::class,
		insert config/app.php in the alias	   : 'Debugbar' => Barryvdh\Debugbar\Facade::class,
		php artisan vendor:publish --provider="Barryvdh\Debugbar\ServiceProvider"


    for languages
    ****Code****

	Route::get('language/{locale}', function ($locale ='en'){
	    session()->put('locale', $locale);
	    return back();
	});
	
	\app\Http\Middleware\App.php
	<?php 
		namespace App\Http\Middleware;
		use Closure, Session;
		class App {
		    /**
		     * The availables languages.
		     *
		     * @array $languages
		     */

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
	in the protected $middlewareGroups array of the app/Http/Kernel.php file.
	    protected $middlewareGroups = [
	        'web' => [
	        	...
				'\App\Http\Middleware\App',

	using
	{{ App::getLocale()}}
	{{ trans('general.title') }}

	for Helper
    ****Code****
		append composer.json in the "autoload": {
        "files": ["app/Helpers/register.php"]
		
		app/Helpers/register.php
		<?php
        	include_once 'TextHelpers.php';

        app/Helpers/TextHelpers.php
        <?php ...

		run composer dump-autoload

        using
		persian_normalizer($text);
		$news_record->slug = persian_slug($text);
		$news_record->slug = turkish_slug($text);
		
		Requests/
		protected function getValidatorInstance() {
			/*
				Automatic generate slug
			*/
		    $this->merge(['slug'=> turkish_slug($this->input('title'))]);
		    return parent::getValidatorInstance();
		}
    ********

### init Nodejs
		
		... from within our project folder
		$ npm init (Optional)
		$ npm install gulp -g

		* install gulp plugin
		$ npm install in the gulpfile.js

		Remove node_modules
		$ npm install rimraf -g $ rimraf node_modules

		* install bower
		Delete bower_components in your root folder
		Create a .bowerrc file in the root
		In the file write this code {"directory" : "resources/vendor"}
		Run a bower install
		$ npm install -g bower

### Remove Public from url
		Reaname /server.php to index.php
		Move public/.htaccess to /.htaccess
		Move public/quickadmin to resources
		Find  "url('quickadmin/" where: \vendor Replace "url('resources/quickadmin/"
		php artisan vendor:publish --force

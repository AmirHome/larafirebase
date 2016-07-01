<!DOCTYPE html>
<html lang="{{ App::getLocale() }}">
    <head>
        @include('partials.temp_head')
        @yield('head_extra')
    </head>
    <body>
        @include('partials.temp_header')
        @yield('content')
        @include('partials.temp_footer')
        @include('partials.temp_javascripts')
        @yield('javascript_extra')
    </body>
</html>

@extends('layouts.temp_master')

@section('page_title', 'home')

@section('head_extra')
<!-- head_extra -->
@endsection

@section('javascript_extra')
<!-- javascript_extra -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.25/vue.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

<script>
    // Initialize Firebase
    var config = {
        apiKey: "{{ config('services.firebase.api_key') }}",
        authDomain: "{{ config('services.firebase.auth_domain') }}",
        databaseURL: "{{ config('services.firebase.database_url') }}",
        storageBucket: "{{ config('services.firebase.storage_bucket') }}",
    };
    firebase.initializeApp(config);

    new Vue({
        el: 'body',

        data: {
            task: '',
            todos: []
        },

        ready: function() {
            var self = this;

            // Initialize firebase realtime database.
            firebase.database().ref('todos/').on('value', function(snapshot) {
                // Everytime the Firebase data changes, update the todos array.
                self.$set('todos', snapshot.val());
            });
        },

        methods: {

            /**
             * Create a new todo and synchronize it with Firebase
             */
            createTodo: function() {
                var self = this;

                // For the sake of simplicity, I'm using jQuery here
                $.post('./todo', {
                    _token: '{!! csrf_token() !!}',
                    task: self.task,
                    is_done: false
                });

                this.task = '';
            }
        }
    });
</script>
@endsection

@section('content')
<div class="container">

    <div class="content">
        <div class="title">Laravel 5</div>
        <a href="{{ url('/language/tr') }}">Türkçe</a> | <a href="{{ url('/language/en') }}">English</a>
        {{ App::getLocale()}}
        {{ trans('general.title') }}

        <pre>{{ session('version') }}</pre>
    </div>


	<h1>Create task</h1>
	<input type="text" v-model="task" placeholder="Task" />
	<a @click="createTodo()">Save</a>

	<table class="table table-bordered">
	    <thead>
	        <tr>
	            <th>Task</th>
	            <th>Done</th>
	        </tr>
	    </thead>
	    <tbody>
	        <template v-for="todo in todos">
	            <tr>
	                <td>
	                    @{{todo.task}}
	                </td>
	                <td>
	                    <input type="checkbox" v-model="todo.is_done" />
	                </td>
	            </tr>
	        </template>
	    </tbody>
	</table>

</div>
@endsection
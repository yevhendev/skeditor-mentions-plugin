/**
 * Created by dm on 25/10/16.
 */
CKEDITOR.plugins.add( 'faces', {
    requires: 'widget',
    // Register the icons. They must match command names.
    icons: 'faces',

    // The plugin initialization logic goes inside this method.
    init: function( editor ) {

        editor.addCommand('selectItem', {

        })

        editor.widgets.add( 'faces',
        {
            template: '<div class="faces"><div class="faces-username"></div><ul class="drpdwn"></ul></div>',
            inline: true,
            editables:
            {
                username:
                {
                    selector: '.faces-username',
                    allowedContent: ''
                }
            },
            allowedContent: 'div(!faces); div(!faces-username)',
            requiredContent: 'div(faces)',
            upcast: function( element ) {
                return element.name == 'div' && element.hasClass( 'faces' );
            },
            button: 'Create a simple box',
            init: function( ) {
                var listeners = editor.contextMenu._.listeners;
                var pasteItem = false;
                var widgetFaces = this;

                this.on('focus', function (ev) {

                    // var pos = function (editor, element) {
                    //     var position = element.getDocumentPosition();
                    //     return {
                    //         'x':position.x-editor.window.getScrollPosition().x,
                    //         'y':position.y-editor.window.getScrollPosition().y
                    //     }
                    // }(editor, this.element);
                    var usernameEl = this.editables.username;
                    if(usernameEl.$.innerText == '\n') {
                        usernameEl.focus();
                    }

                    usernameEl.$.addEventListener("input", function(e) {
                        var names = search($(this).text().replace('@',''))
                        $(widgetFaces.element.$).find('ul').html('')
                        if($(this).text() == '') {
                            widgetFaces.destroy();
                            widgetFaces.element.$.remove();
                            editor.focus()
                        }

                        //editor.contextMenu._.listeners = [];
                        if(names.length > 0) {
                            console.log(names.slice( 0, 10 ))
                            $.each(names.slice( 0, 10 ), function (i, name) {

                                var li = $('<li></li>')
                                var a = $('<a href="#">' + '<img src="'+name.picture.thumbnail+'" alt="">'
                                    +name.login.username+' (' + name.name.first + ' ' + name.name.last +')</a>')
                                a.click(function () {
                                    widgetFaces.setData( 'user', name );
                                    $(usernameEl.$).text('@'+name.login.username);
                                    $(usernameEl.$).attr('contenteditable', false);
                                    $(usernameEl.$).removeClass('cke_widget_editable');
                                    var space = new CKEDITOR.dom.element( 'span' );
                                    space.setText(' ');
                                    space.insertAfter( widgetFaces.element.getParent() );
                                    space.focusNext();
                                    var range = editor.createRange();
                                    range.setStart( space, 1 ); // <p>^foo
                                    range.setEnd( space, 0 ); // <em>b^ar</em>
                                    editor.getSelection().selectRanges( [ range ] );
                                    editor.focus();
                                    $(widgetFaces.element.$).find('ul').hide()

                                }).data(name)
                                $(widgetFaces.element.$).find('ul').append(li.append(a))

                            });

                            $(widgetFaces.element.$).find('ul').show()

                       }

                    }, false);
                });
                $(this.editables.username.$).on('blur', function () {
                    // editor.contextMenu._.listeners = [];
                    // editor.contextMenu._.listeners = listeners;
                    if($(this).text() == '') {
                        //widgetFaces.element.$.remove();
                        // var selection = editor.getSelection();
                        // var range = selection.getRanges()[0];
                        // var pCon = range.startContainer.getAscendant({p:2},true); //getAscendant('p',true);
                        // var newRange = new CKEDITOR.dom.range(range.document);
                        // newRange.moveToPosition(pCon, CKEDITOR.POSITION_BEFORE_END);
                        // newRange.select();
                        // editor.focus();
                        widgetFaces.destroyEditable();
                        widgetFaces.destroy();
                        //$('.faces').remove()

                    }
                })
                $(this.editables.username.$).on('click', function () {

                    if($(this).attr('contenteditable')=='false') {
                        alert('Event for user info (' + widgetFaces.data.user.name.first + ' ' + widgetFaces.data.user.name.last+')')
                    }
                })
            }
        });

        editor.on('key', function(event) {
            var pressedKeyCode = event.data.keyCode;
            if ( pressedKeyCode === 2228274 ) {
                editor.execCommand( 'faces' );
             }
        });

        editor.on('change', function (event) {
        });

        function search (uname) {
            if(typeof window.result == 'undefined') {
                window.result = [];
                $.ajax({
                    url: "users.json",
                    dataType: 'json',
                    async: false,
                    success: function(json) {
                        window.result = json.results;
                    }
                });
            }
            var fuse = new Fuse(window.result, {
                keys: [
                    "login.username"
                ]
            });
            return fuse.search(uname);
        }
    }

});
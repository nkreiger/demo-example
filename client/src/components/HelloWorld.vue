<template>
    <div class="hello">
        <div class="row">
            <div class="col s12">
                <div class="card horizontal">
                    <div id="chat-messages" class="card-content" v-html="chatContent">
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="joined">
            <div class="input-field col s8">
                <input type="text" v-model="newMsg" @keyup.enter="send">
            </div>
            <div class="input-field col s4">
                <button class="waves-effect waves-light btn" @click="send">
                    <i class="material-icons right">chat</i>
                    Send
                </button>
            </div>
        </div>
        <div class="row" v-if="!joined">
            <div class="input-field col s8">
                <input type="email" v-model.trim="email" placeholder="Email">
            </div>
            <div class="input-field col s8">
                <input type="text" v-model.trim="username" placeholder="Username">
            </div>
            <div class="input-field col s4">
                <button class="waves-effect waves-light btn" @click="join()">
                    <i class="material-icons right">done</i>
                    Join
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data: () => ({
            ws: null, // Our websocket
            newMsg: '', // Holds new messages to be sent to the server
            chatContent: '', // A running list of chat messages displayed on the screen
            email: null, // Email address used for grabbing an avatar
            username: null, // Our username
            joined: false // True if email and username have been filled in
        }),

        created: function () {
            let self = this;
            this.ws = new WebSocket('ws://localhost:8000/ws');
            // eslint-disable-next-line no-console
            console.log(this.ws);
            this.ws.addEventListener('message', function (e) {
                let msg = JSON.parse(e.data);
                self.chatContent += '<div class="chip">'
                    + '<img src="' + self.gravatarURL(msg.email) + '">' // Avatar
                    + msg.username
                    + '</div>'
                    + msg.message +  '<br/>'; // Parse emojis

                let element = document.getElementById('chat-messages');
                element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
            });
        },

        methods: {
            send: function () {
                if (this.newMsg != '') {
                    this.ws.send(
                        JSON.stringify({
                                email: this.email,
                                username: this.username,
                                message: this.newMsg// Strip out html
                            }
                        ));
                    this.newMsg = ''; // Reset newMsg
                }
            },

            join: function () {
                if (!this.email) {
                  // eslint-disable-next-line no-undef
                    alert('You must enter an email', 2000);
                    return
                }
                if (!this.username) {
                  // eslint-disable-next-line no-undef
                    alert('You must choose a username', 2000);
                    return
                }
                this.email = this.email.toString();
                this.username = this.username.toString();
                this.joined = true;
            },

            gravatarURL: function (email) {
                return 'http://www.gravatar.com/avatar/' + email;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>

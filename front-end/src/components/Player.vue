<template>
  <div class="aspect-ratio-preserving-container">
    <iframe id="gameRoot"></iframe>
  </div>
  <div id="commentSection" class="container">
    <p><strong>Comments</strong></p>
    <div v-for="comment in comments" class="comment" v-bind:key="comment._id">
      <p>
        {{comment.content}}
      </p>
      <p>-- {{comment.user.firstName}} {{comment.user.lastName}} (@{{comment.user.username}}, posted {{comment.created}})</p>
      <br />
    </div>
  </div>
  <div id="addComment" class="container">
    <form v-if="this.$root.$data.user" @submit.prevent="comment">
      <hr />
      <p>Add a comment!</p>
      <textarea v-model="commentText"></textarea>
      <p><button>Post</button></p>
    </form>
    <div v-else>
      Please log in on the Create page to add a comment.
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    props: {
      game: String
    },
    data() {
      return {
        comments: [],
        commentText: '',
      };
    },
    methods: {
      getComments() {
        fetch("/api/comments/" + this.game).then((response) => {
          response.text().then((objText) => {
            if (objText == "Internal Server Error") {
              this.comments = [{
                content: "We ran into an issue when retrieving comments. Please try again later.",
                user: {
                  firstName: "MTRE",
                  lastName: "API"
                },
                created: "now"
              }];
            }
            this.comments = JSON.parse(objText);
          })
        });
      },
      setPlayerDestination() {
        document.getElementById("gameRoot").src = "/games/" + this.game + "/index.html";
        this.getComments();
      },
      async comment() {
        try {
          await fetch("/api/comments/" + this.game, {
            method: 'POST',
            body: JSON.stringify({
              content: this.commentText
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.log(error.response.data);
        }
        this.getComments();
      }
    },
    mounted() {
      this.setPlayerDestination()
    },
    watch: {
      game() {
        this.setPlayerDestination()
      }
    },
    changed() {
      this.setPlayerDestination()
    }
  }
</script>

<style scoped>
  #gameRoot {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  .aspect-ratio-preserving-container {
    position: relative;
    padding-bottom: 56.25%;
  }
</style>

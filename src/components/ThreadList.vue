<template>
  <!-- Thread List START -->
  <div class="content is-medium">
    <h3 class="title is-3">Threads</h3>
    <div v-for="thread in threads" :key="thread._id" class="box">
      <div v-if="thread.user.name != undefined" class="thread-creator">
        <figure class="media-left is-rounded user-image">
          <p class="image is-32x32">
            <img class="is-rounded" :src="thread.user.avatar" />
          </p>
        </figure>
        <p class="is-family-secondary" >
          {{ thread.user.name }}
        </p>
      </div>

      <h4 id="const" class="title is-3">{{ thread.title }}</h4>
      <PostCreate v-if="canMakePost" :threadId="thread._id" />
      <article
        v-for="post in thread.posts"
        :key="post._id"
        class="media post-item"
      >
        <figure class="media-left is-rounded user-image">
          <p class="image is-32x32">
            <img class="is-rounded" :src="post.user.avatar" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content is-medium">
            <div class="post-content">
              <strong class="author">{{ post.user.name }}</strong>
              {{ " " }}
              <small class="post-time">{{ post.updatedAt | fromNow }}</small>
              <br />
              <p class="post-content-message">{{ post.text }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import PostCreate from "@/components/PostCreate";
export default {
  components: {
    PostCreate,
  },
  props: {
    threads: {
      type: Array,
      required: true,
    },
    canMakePost: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
// Thread List START
.content {
  figure {
    margin-bottom: 0;
  }
}

.media-content {
  background-color: #f1f1f1;
  padding: 3px 20px;
  border-radius: 10px;
  margin-right: 40px;
  width: 100px;
}
.thread-creator{
  display: flex;
  opacity: 50%;
  padding-bottom: 15px;
}
.media-left.user-image {
  margin: 0;
  margin-right: 15px;
}
.media + .media {
  border: none;
  margin-top: 0;
}

.post-content {
  margin: 0;
  &-message {
    font-size: 16px;
  }

  .author {
    font-size: 18px;
  }

  .post-time {
    font-size: 16px;
  }
}
</style>

<template>
  <!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css"> -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
</head>

<body>
    <div class="footer-basic">
        <footer>
            <div class="social"><a href="#"><i class="icon ion-social-instagram"></i></a><a href="#"><i class="icon ion-social-snapchat"></i></a><a href="#"><i class="icon ion-social-twitter"></i></a><a href="#"><i class="icon ion-social-facebook"></i></a></div>
            <ul class="list-inline">
                <li class="list-inline-item"><router-link :to="{name: 'PageHome'}">Home</router-link></li>
                <li class="list-inline-item"><router-link :to="{name: 'PageAboutUs'}" >About</router-link></li>
                <li class="list-inline-item"><router-link :to="{ name: 'PageContactUs'}" >Contact</router-link></li>
                <li class="list-inline-item"><router-link :to="{ name: 'PageFAQ'}" >FAQ</router-link></li>
                <li v-if="!user" class="list-inline-item"><router-link :to="{ name: 'PageLogin'}">Login</router-link></li>
            </ul>
            <p class="copyright">Meetuper © 2022</p>
        </footer>
    </div>
  
</body>

</html>
</template>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.bundle.min.js"></script>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
      ...mapGetters({
        user: "auth/authUser"
      })
  }
};
</script>

<style scoped>
.footer-basic {
  padding:40px 0;
  background-color:#ffffff;
  color:#4b4c4d;
}
ul {
  display: flex;
  justify-content: center;
}

.footer-basic ul {
  padding:0;
  list-style:none;
  text-align:center;
  font-size:18px;
  line-height:1.6;
  margin-bottom:0;
}

.footer-basic li {
  padding:0 10px;
}

.footer-basic ul a {
  color:inherit;
  text-decoration:none;
  opacity:0.8;
}

.footer-basic ul a:hover {
  opacity:1;
}

.footer-basic .social {
  text-align:center;
  padding-bottom:25px;
}

.footer-basic .social > a {
  font-size:24px;
  width:40px;
  height:40px;
  line-height:40px;
  display:inline-block;
  text-align:center;
  border-radius:50%;
  border:1px solid #ccc;
  margin:0 8px;
  color:inherit;
  opacity:0.75;
}

.footer-basic .social > a:hover {
  opacity:0.9;
}

.footer-basic .copyright {
  margin-top:15px;
  text-align:center;
  font-size:13px;
  color:#aaa;
  margin-bottom:0;
}
</style>

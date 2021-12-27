<template>
<div class="mall-box">
  <span>r</span>
  <span>e</span>
  <span>s</span>
  <span>e</span>
  <span>t</span>
  <span>p</span>
  <span>a</span>
  <span>s</span>
  <span>s</span>
  <span>w</span>
  <span>o</span>
  <span>r</span>
  <span>d</span>
</div>
</template>

<script>
export default {
  name: "ResetPassword"
}
</script>

<style scoped lang="sass">
$black: #000
$begin:1
$end:13
.mall-box
  width: 100vw
  height: 100vh
  background-color: $black
  span
    display: inline-block
    font-family: "Rage Italic", serif
    font-size: 10rem
    text-shadow: 0 0 0 whitesmoke
    animation: smoky 5s

@keyframes smoky
  to
    transform: translateX(20rem) translateY(-5rem) rotateY(-40deg) skew(70deg) scale(1.5)
    text-shadow: 0 0 20rem whitesmoke
    opacity: 0

@for $item from $begin through $end
  span:nth-of-type(#{$item})
    animation-delay: #{$item}/(#{$end}/2)s

</style>
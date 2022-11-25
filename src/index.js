import $ from "jquery";
import gsap from "gsap";
import "./css/style.css"; // css 注入

console.log("start");

// jquery
$("body").css("background-color", "#333");

// gsap
gsap.set(".box", {
    x: 300,
    y: 300,
});
gsap.to(".box", {
    duration: 2,
    rotation: 360,
    repeat: -1,
    scale: 3,
});

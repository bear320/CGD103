import $ from "jquery";
import gsap from "gsap";

// css 注入
import "./css/style.css";
// import "./css/header.css";
import "./css/footer.css";
import "./sass/style.scss";

console.log("start");

// jquery
$("body").css("background-color", "lightblue");

// gsap
gsap.set(".box", {
    x: 300,
    y: 300,
});
const tl = gsap.timeline();
tl.to(".box", {
    duration: 2,
    rotation: 360,
    scale: 3,
}).to(".box", {
    x: 700,
    y: 500,
    backgroundColor: beige,
});

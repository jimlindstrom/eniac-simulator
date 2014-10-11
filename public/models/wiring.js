'use strict';

angular.module('myApp')

.factory('Wiring', function() {
  function Wiring() { }

  function elem_bbox_center(elem) {
    var rect = elem.getBoundingClientRect();
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = elem.getBoundingClientRect(),
        y = ((elemRect.top+elemRect.bottom)/2) - bodyRect.top,
        x = ((elemRect.left+elemRect.right)/2) - bodyRect.left;
    return {x: x, y: y};
  }

  function midpoint_2d(point1, point2) {
     return {x: (point1.x+point2.x)/2.0, 
             y: (point1.y+point2.y)/2.0};
  }

  function dist_2d(point1, point2) {
    var sum_sqrd = (point2.x - point1.x)*(point2.x - point1.x) +
                   (point2.y - point1.y)*(point2.y - point1.y);
    return Math.sqrt(sum_sqrd);
  }

  function rotation_deg(point1, point2) {
    var adj = point1.x - point2.x;
    var opp = point1.y - point2.y;
    return Math.atan(opp/adj)*180/Math.PI;
  }

  function draw_wire_node(point) {
    var style = "top:  "+(point.y-6)+"px;" +
                "left: "+(point.x-4)+"px;";
    var html = "<div class=\"control-wire-node\" style=\""+style+"\"></div>";
    angular.element(document.body).append(html);
  }

  function draw_wire_line(point1, point2) {
    var midpt = midpoint_2d(point1, point2);
    var width = dist_2d(point1, point2);
    var deg = rotation_deg(point1, point2);

    var outer_style = "top:  "+(midpt.y-2)+"px;" +
                      "left: "+(midpt.x-2)+"px;";
    var inner_style = "margin-left: -"+(width/2)+"px;" +
                      "width: "+width+"px;" +
                      "    -ms-transform: rotate("+deg+"deg);" +
                      "-webkit-transform: rotate("+deg+"deg);" +
                      "        transform: rotate("+deg+"deg);";
    var html =        "<div class=\"control-wire-outer\" style=\""+outer_style+"\">" +
                      "<div class=\"control-wire-inner\" style=\""+inner_style+"\">" +
                      "</div></div>";

    angular.element(document.body).append(html);
  }

  Wiring.draw_connection = function (elem1, elem2) {
    var pt1 = elem_bbox_center(elem1);
    var pt2 = elem_bbox_center(elem2);

    draw_wire_line(pt1, pt2);
    draw_wire_node(pt1);
    draw_wire_node(pt2);
  }

  Wiring.destroy_connections = function () {
    var elems = document.getElementsByClassName("control-wire-outer");
    for (var i = elems.length - 1; i >= 0; i--) {
      elems[i].parentNode.removeChild(elems[i]);
    }

    var elems = document.getElementsByClassName("control-wire-node");
    for (var i = elems.length - 1; i >= 0; i--) {
      elems[i].parentNode.removeChild(elems[i]);
    }
  }

  return Wiring;
});

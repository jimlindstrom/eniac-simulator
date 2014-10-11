'use strict';

angular.module('myApp')

.factory('Wiring', 
         ['$compile', '$rootScope',
          function($compile, $rootScope) {
  function Wiring() { }

  function elem_tooltip(elem) {
    return elem.getAttribute("ng-tooltip") || "Unknown port";
  }

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

  function draw_horiz_data_plug(point) {
    var width  = 48;
    var height = 17;

    var outer_style = "position: absolute;" +
                      "top:  "+(point.y)+"px;" +
                      "left: "+(point.x)+"px;";
    var inner_style = "margin-left: -"+(width /2)+"px;" +
                      "margin-top:  -"+(height/2)+"px;" +
                      "width:  "+width +"px;" +
                      "height: "+height+"px;" +
                      "background-color: #444;";
    var html =        "<div class=\"data-plug-outer\" style=\""+outer_style+"\">" +
                      "<div class=\"data-plug-inner\" style=\""+inner_style+"\">" +
                      "</div></div>";

    angular.element(document.body).append(html);
  }

  function draw_vert_data_plug(point) {
    var width  = 17;
    var height = 48;

    var outer_style = "position: absolute;" +
                      "top:  "+(point.y)+"px;" +
                      "left: "+(point.x)+"px;";
    var inner_style = "margin-left: -"+(width /2)+"px;" +
                      "margin-top:  -"+(height/2)+"px;" +
                      "width:  "+width +"px;" +
                      "height: "+height+"px;" +
                      "background-color: #444;";
    var html =        "<div class=\"data-plug-outer\" style=\""+outer_style+"\">" +
                      "<div class=\"data-plug-inner\" style=\""+inner_style+"\">" +
                      "</div></div>";

    angular.element(document.body).append(html);
  }

  function draw_control_plug(point) {
    var style = "top:  "+(point.y-4)+"px;" +
                "left: "+(point.x-4)+"px;";
    var html = "<div class=\"control-plug\" style=\""+style+"\"></div>";
    angular.element(document.body).append(html);
  }

  function draw_wire_line(point1, point2, tooltip) {
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
    var html =        "<div class=\"control-wire-outer\" style=\""+outer_style+"\" ng-tooltip=\""+tooltip+"\">" +
                      "<div class=\"control-wire-inner\" style=\""+inner_style+"\">" +
                      "</div></div>";

    angular.element(document.body).append($compile(html)($rootScope.$new()));
  }

  Wiring.draw_horiz_data_connection = function (elem1, elem2) {
    var tooltip1 = elem_tooltip(elem1);
    var tooltip2 = elem_tooltip(elem2);
    var tooltip = tooltip1 + " <-> " + tooltip2;
    var pt1 = elem_bbox_center(elem1);
    var pt2 = elem_bbox_center(elem2);

    draw_horiz_data_plug(pt1);
    draw_horiz_data_plug(pt2);
    draw_wire_line(pt1, pt2, tooltip);
  }

  Wiring.draw_vert_data_connection = function (elem1, elem2) {
    var tooltip1 = elem_tooltip(elem1);
    var tooltip2 = elem_tooltip(elem2);
    var tooltip = tooltip1 + " <-> " + tooltip2;
    var pt1 = elem_bbox_center(elem1);
    var pt2 = elem_bbox_center(elem2);

    draw_vert_data_plug(pt1);
    draw_horiz_data_plug(pt2);
    draw_wire_line(pt1, pt2, tooltip);
  };

  Wiring.draw_control_connection = function (elem1, elem2) {
    var tooltip1 = elem_tooltip(elem1);
    var tooltip2 = elem_tooltip(elem2);
    var tooltip = tooltip1 + " <-> " + tooltip2;
    var pt1 = elem_bbox_center(elem1);
    var pt2 = elem_bbox_center(elem2);

    draw_control_plug(pt1);
    draw_control_plug(pt2);
    draw_wire_line(pt1, pt2, tooltip);
  };

  Wiring.connect_all_control_ports = function () {
    var q = "//div[contains(@data-dest-id, '-') and contains(@class, 'control-connector')]";
    var result = document.evaluate(q, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result) {
      for (var i=0, len=result.snapshotLength; i < len; i++) {
        var elem1 = result.snapshotItem(i);
        var destId = elem1.dataset.destId;
        if (destId) {
          var elem2 = document.getElementById(destId);
          if (elem2) {
            Wiring.draw_control_connection(elem1, elem2);
          }
        }
      }
    }
  };

  Wiring.connect_all_vert_data_ports = function () {
    var q = "//div[contains(@data-dest-id, '-') and contains(@class, 'horiz-connector')]";
    var result = document.evaluate(q, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result) {
      for (var i=0, len=result.snapshotLength; i < len; i++) {
        var elem1 = result.snapshotItem(i);
        var destId = elem1.dataset.destId;
        if (destId) {
          var elem2 = document.getElementById(destId);
          if (elem2) {
            Wiring.draw_horiz_data_connection(elem1, elem2);
          }
        }
      }
    }
  };

  Wiring.connect_all_horiz_data_ports = function () {
   var q = "//div[contains(@data-dest-id, '-') and contains(@class, 'vert-connector')]";
    var result = document.evaluate(q, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result) {
      for (var i=0, len=result.snapshotLength; i < len; i++) {
        var elem1 = result.snapshotItem(i);
        var destId = elem1.dataset.destId;
        if (destId) {
          var elem2 = document.getElementById(destId);
          if (elem2) {
            Wiring.draw_vert_data_connection(elem1, elem2);
          }
        }
      }
    }
  };

  Wiring.connect_all_ports = function () {
    Wiring.connect_all_control_ports();
    Wiring.connect_all_horiz_data_ports();
    Wiring.connect_all_vert_data_ports();
  }

  Wiring.destroy_connections = function () {
    var elems = document.getElementsByClassName("control-wire-outer");
    for (var i = elems.length - 1; i >= 0; i--) {
      elems[i].parentNode.removeChild(elems[i]);
    }

    var elems = document.getElementsByClassName("control-plug");
    for (var i = elems.length - 1; i >= 0; i--) {
      elems[i].parentNode.removeChild(elems[i]);
    }

    var elems = document.getElementsByClassName("data-plug-outer");
    for (var i = elems.length - 1; i >= 0; i--) {
      elems[i].parentNode.removeChild(elems[i]);
    }
  };

  return Wiring;
}]);

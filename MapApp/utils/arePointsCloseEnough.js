import haversineDistance from "haversine-distance";

export default function arePointsCloseEnough(firstPoint, secondPoint, distance) {
  return haversineDistance(firstPoint, secondPoint) <= distance;
};
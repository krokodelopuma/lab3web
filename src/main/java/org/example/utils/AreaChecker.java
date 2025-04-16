package org.example.utils;

/**
 * Utility class to check if a point lies within a defined area.
 */
public class AreaChecker {

    public static boolean isInArea(double x, double y, double r) {
        // Прямоугольник: x ∈ [-R, 0], y ∈ [0, R]
        if (x >= -r && x <= 0 && y >= 0 && y <= r) {
            return true;
        }

        // Треугольник: x ∈ [-R/2, 0], y ∈ [-R/2, 0], y >= 2x
        if (x >= -r / 2 && x <= 0 && y >= -r / 2 && y <= 0 && y >= -x - 1) {
            return true;
        }

        // Четверть круга: x ∈ [0, R], y ∈ [-R, 0], x^2 + y^2 <= R^2
        if (x >= 0 && x <= r && y >= -r && y <= 0 && (x*x + y*y <= r*r)) {
            return true;
        }

        return false;
    }



    private static boolean isXInArea(double x){
        return x >= -5 && x <= 5;
    }

    private static boolean isYInArea(double y){
        return y >= -3 && y <= 5;
    }

    private static boolean isRInArea(double r){
        return r >= 2 && r <= 5;
    }
}
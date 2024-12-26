<?php
function findExpression($numbers, $target, $currentExpression = '', $currentValue = 0) {
    if (count($numbers) === 1) {
        $lastNumber = $numbers[0];
        if ($currentValue + $lastNumber === $target) {
            return $currentExpression . ' + ' . $lastNumber;
        } elseif ($currentValue - $lastNumber === $target) {
            return $currentExpression . ' - ' . $lastNumber;
        } elseif ($currentValue * $lastNumber === $target) {
            return $currentExpression . ' * ' . $lastNumber;
        }
        return null;
    }

    for ($i = 0; $i < count($numbers); $i++) {
        $currentNumber = $numbers[$i];
        $remainingNumbers = $numbers;
        unset($remainingNumbers[$i]);
        $remainingNumbers = array_values($remainingNumbers);

        // Tambah
        $result = findExpression($remainingNumbers, $target, $currentExpression ? "($currentExpression + $currentNumber)" : "$currentNumber", $currentValue + $currentNumber);
        if ($result !== null) return $result;

        // Kurang
        $result = findExpression($remainingNumbers, $target, $currentExpression ? "($currentExpression - $currentNumber)" : "$currentNumber", $currentValue - $currentNumber);
        if ($result !== null) return $result;

        // Kali
        $result = findExpression($remainingNumbers, $target, $currentExpression ? "($currentExpression * $currentNumber)" : "$currentNumber", $currentValue * $currentNumber);
        if ($result !== null) return $result;
    }

    return null;
}

$source = [1, 4, 5, 6];
$target = 50;
$result = findExpression($source, $target);
if ($result !== null) {
    echo "Output: " . $result . "\n";
} else {
    echo "Tidak ada solusi untuk mencapai target $target\n";
}
?>
<?php
function cariAngkaHilang(array $arr) {
    $result = '';

    $rangeArray = range(min($arr), max($arr));

    $res = array_diff($rangeArray, $arr);
    
    $i = 1;
    foreach ($res as $value) {
        $result .= $value;
        if($i!=count($res)){
            $result .= ',';
        }
        $i++;
    }
    
    return $result;
}

$input1 = [3, 0, 4];
echo "Output: " . cariAngkaHilang($input1) . "\n <br>";

$input2 = [3106, 3102, 3104, 3105, 3107];
echo "Output: " . cariAngkaHilang($input2) . "\n <br>";
?>

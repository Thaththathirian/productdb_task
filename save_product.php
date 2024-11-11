<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "productDB";

$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['productCode']) || 
    empty($data['productName']) || 
    empty($data['category']) || 
    empty($data['costPrice'])
) {
    echo json_encode(["status" => "error", "message" => "All required fields must be filled."]);
    exit;
}

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $product_code = $data['productCode'];
    $product_name = $data['productName'];
    $category = $data['category'];
    $sub_category = $data['subCategory'];
    $unit = $data['unit'];
    $hsn = $data['hsn'];
    $cost_price = $data['costPrice'];
    $selling_price = $data['sellingPrice'];
    $gst_amount = $data['gstAmount'];
    $mrp = $data['mrp'];

    $sql = "INSERT INTO products (product_code, product_name, category, sub_category, unit, hsn, cost_price, selling_price, gst_amount, mrp) 
            VALUES ('$product_code', '$product_name', '$category', '$sub_category', '$unit', '$hsn', '$cost_price', '$selling_price', '$gst_amount', '$mrp')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Product saved successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }

    $conn->close();
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

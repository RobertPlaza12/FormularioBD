<?php
header("Content-Type: application/json");

$DB_FILE = "../data/inventario.json";

if (!file_exists($DB_FILE)) {
    file_put_contents($DB_FILE, json_encode([]));
}

function db_read($file) {
    return json_decode(file_get_contents($file), true);
}

function db_write($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$request = json_decode(file_get_contents("php://input"), true);
$action = $request["action"] ?? null;

$data = db_read($DB_FILE);

switch ($action) {

    // INSERTAR
    case "insert":
        $new = [
            "id" => uniqid(), // ID único
            "nombre" => $request["nombre"] ?? "",
            "cantidad" => intval($request["cantidad"] ?? 0),
            "precio" => floatval($request["precio"] ?? 0)
        ];

        $data[] = $new;
        db_write($DB_FILE, $data);

        echo json_encode(["status" => "ok", "msg" => "Insertado correctamente", "item" => $new]);
        break;

    // ACTUALIZAR
    case "update":
        foreach ($data as &$item) {
            if ($item["id"] === $request["id"]) {
                $item["nombre"] = $request["nombre"];
                $item["cantidad"] = intval($request["cantidad"]);
                $item["precio"] = floatval($request["precio"]);
                db_write($DB_FILE, $data);

                echo json_encode(["status" => "ok", "msg" => "Actualizado correctamente"]);
                exit;
            }
        }
        echo json_encode(["status" => "error", "msg" => "ID no encontrado"]);
        break;

    // ELIMINAR
    case "delete":
        $filtered = array_filter($data, fn($item) => $item["id"] !== $request["id"]);
        db_write($DB_FILE, array_values($filtered));

        echo json_encode(["status" => "ok", "msg" => "Eliminado correctamente"]);
        break;

    // OBTENER UN REGISTRO
    case "get":
        foreach ($data as $item) {
            if ($item["id"] === $request["id"]) {
                echo json_encode(["status" => "ok", "item" => $item]);
                exit;
            }
        }
        echo json_encode(["status" => "error", "msg" => "ID no encontrado"]);
        break;

    // OBTENER TODOS
    case "all":
        echo json_encode(["status" => "ok", "items" => $data]);
        break;

    default:
        echo json_encode(["status" => "error", "msg" => "Acción inválida"]);
        break;
}
?>

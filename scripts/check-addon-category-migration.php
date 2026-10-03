<?php
require getcwd() . '/vendor/autoload.php';
$app = require getcwd() . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
config(['database.default' => 'migration_test', 'database.connections.migration_test' => [
    'driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => true,
]]);
Illuminate\Support\Facades\Schema::create('add_ons', function ($table) {
    $table->string('id')->primary(); $table->string('name'); $table->integer('price');
});
$db = Illuminate\Support\Facades\DB::class;
$db::table('add_ons')->insert([
    ['id' => 'a', 'name' => ' Ongkir ', 'price' => 25000],
    ['id' => 'b', 'name' => 'ONGKIR', 'price' => 40000],
    ['id' => 'c', 'name' => 'Sambal', 'price' => 5000],
]);
$migration = require getcwd() . '/database/migrations/2026_10_03_000000_create_add_on_categories.php';
$migration->up();
$rows = $db::table('add_ons')->orderBy('id')->get();
if (!$rows[0]->category_id || $rows[0]->category_id !== $rows[1]->category_id || $rows[2]->category_id !== null || $rows[0]->price !== 25000) {
    throw new RuntimeException('Migration grouping failed');
}
$controller = app(App\Http\Controllers\AddOnCategoryController::class);
$created = $controller->store(Illuminate\Http\Request::create('/', 'POST', ['name' => ' Kemasan ']))->getData(true);
if ($created['data']['name'] !== 'Kemasan') throw new RuntimeException('Category creation failed');
if (count($controller->index()->getData(true)['data']) !== 2) throw new RuntimeException('Category listing failed');
$migration->down();
if (Illuminate\Support\Facades\Schema::hasColumn('add_ons', 'category_id') || $db::table('add_ons')->count() !== 3) throw new RuntimeException('Rollback failed');
echo "PASS: category migration, Ongkir backfill, preserved master records, category creation/listing, rollback (SQLite memory only).\n";

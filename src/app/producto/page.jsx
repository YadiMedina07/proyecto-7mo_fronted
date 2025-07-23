"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  Search,
  Filter,
  ShoppingCart as CartIcon,
  CreditCard as CardIcon,
  Package,
  Star,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const RESTOCK_DAYS = 5;

export default function ProductosPage() {
  const { theme } = useAuth();
  const router = useRouter();

  // Helpers para clases condicionales
  const light = (s) => (theme === "light" ? s : "");
  const dark  = (s) => (theme === "dark"  ? s : "");

  // Estados
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroFlavor, setFiltroFlavor] = useState("Todos los sabores");
  const [filtroSize, setFiltroSize] = useState("Todos los tamaños");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga de productos
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/`, { credentials: "include" });
        if (!res.ok) throw new Error("Error al cargar productos");
        const { productos } = await res.json();
        setProductos(productos);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Filtrado
  const productosFiltrados = productos.filter((p) => {
    const texto = busquedaGeneral.trim().toLowerCase();
    const matchGeneral =
      p.name.toLowerCase().includes(texto) ||
      p.description.toLowerCase().includes(texto) ||
      p.sabor.toLowerCase().includes(texto);
    const matchFlavor =
      filtroFlavor === "Todos los sabores" ||
      p.sabor.toLowerCase() === filtroFlavor.toLowerCase();
    const matchSize =
      filtroSize === "Todos los tamaños" ||
      p.tamano === Number(filtroSize);
    const precio = Number(p.precio);
    const min = filtroPrecioMin ? Number(filtroPrecioMin) : null;
    const max = filtroPrecioMax ? Number(filtroPrecioMax) : null;
    const matchMin = min === null || precio >= min;
    const matchMax = max === null || precio <= max;
    return matchGeneral && matchFlavor && matchSize && matchMin && matchMax;
  });

  const disponibles = productosFiltrados.filter((p) => p.stock > 0);
  const agotados    = productosFiltrados.filter((p) => p.stock === 0);

  // Función: agrega al carrito
  const handleAgregarAlCarrito = async (producto) => {
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: producto.id, cantidad: 1 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al agregar al carrito");
      }
      alert("Producto agregado al carrito");
    } catch (err) {
      alert(err.message);
    }
  };

  // Función: comprar directo
  const handleComprarDirecto = async (producto) => {
    await handleAgregarAlCarrito(producto);
    router.push("/pedidos");
  };

  const sabores = [
    "Cafe","Capulin","Mandarina","Naranja","Jobo","Fresa","Arandano","Tamarindo",
    "Lichi","Maracuya","Coco","Canela","Zarzamora","Mango","Guayaba","Limon",
    "Jerez","Ciruela","Piña/Maracuya","Naranja/Maracuya",
  ];

  return (
    <div className={`min-h-screen py-8 pt-36 px-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto max-w-7xl">
        <Breadcrumbs pages={[{ name: "Home", path: "/" }, { name: "Productos", path: "/producto" }]} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Nuestros Productos</h1>
          <p className="text-muted-foreground text-lg">Descubre nuestra selección de productos artesanales</p>
        </div>

        {/* Buscador */}
        <Card className={`mb-8 ${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")}`}>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={busquedaGeneral}
                onChange={(e) => setBusquedaGeneral(e.target.value)}
                className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")} pl-10 h-12 text-lg`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de Filtros */}
          <div className="lg:col-span-1">
            <Card className={`sticky top-4 ${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Filtros</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sabor */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sabor</Label>
                  <Select value={filtroFlavor} onValueChange={setFiltroFlavor}>
                    <SelectTrigger className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")} text-left`}>
                      <SelectValue placeholder="Todos los sabores" />
                    </SelectTrigger>
                    <SelectContent className={`${dark("bg-gray-800 text-gray-100")}`}>
                      <SelectItem value="Todos los sabores">Todos los sabores</SelectItem>
                      {sabores.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Tamaño */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tamaño (ml)</Label>
                  <Select value={filtroSize} onValueChange={setFiltroSize}>
                    <SelectTrigger className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")} text-left`}>
                      <SelectValue placeholder="Todos los tamaños" />
                    </SelectTrigger>
                    <SelectContent className={`${dark("bg-gray-800 text-gray-100")}`}>
                      <SelectItem value="Todos los tamaños">Todos los tamaños</SelectItem>
                      <SelectItem value="250">250 ml</SelectItem>
                      <SelectItem value="750">750 ml</SelectItem>
                      <SelectItem value="1000">1000 ml</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Precio */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rango de Precio</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="$0"
                      value={filtroPrecioMin}
                      onChange={(e) => setFiltroPrecioMin(e.target.value)}
                      className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")} text-sm`}
                    />
                    <Input
                      type="number"
                      placeholder="$999"
                      value={filtroPrecioMax}
                      onChange={(e) => setFiltroPrecioMax(e.target.value)}
                      className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")} text-sm`}
                    />
                  </div>
                </div>
                {/* Filtros activos */}
                {(
                  filtroFlavor !== "Todos los sabores" ||
                  filtroSize   !== "Todos los tamaños" ||
                  filtroPrecioMin ||
                  filtroPrecioMax
                ) && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Filtros activos:</span>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setFiltroFlavor("Todos los sabores");
                        setFiltroSize("Todos los tamaños");
                        setFiltroPrecioMin("");
                        setFiltroPrecioMax("");
                      }}>
                        Limpiar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {filtroFlavor !== "Todos los sabores" && <Badge variant="secondary" className="text-xs">{filtroFlavor}</Badge>}
                      {filtroSize   !== "Todos los tamaños" && <Badge variant="secondary" className="text-xs">{filtroSize}ml</Badge>}
                      {(filtroPrecioMin || filtroPrecioMax) && <Badge variant="secondary" className="text-xs">${filtroPrecioMin || 0} - ${filtroPrecioMax || "∞"}</Badge>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Área de Productos */}
          <div className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className={`${light("bg-white")} ${dark("bg-gray-800")}`}>
                    <CardContent className="p-0">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Productos Disponibles */}
                {disponibles.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Productos Disponibles</h2>
                      <Badge variant="outline" className="text-sm">{disponibles.length} productos</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {disponibles.map((prod) => (
                        <Card
                          key={prod.id}
                          className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")}`}
                          onClick={() => router.push(`/producto/${prod.id}`)}
                        >
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                              {prod.imagenes?.[0] ? (
                                <img
                                  src={prod.imagenes[0].imageUrl || "/placeholder.svg"}
                                  alt={prod.name}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center">
                                  <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                              <Badge className="absolute top-2 right-2 bg-green-500">Disponible</Badge>
                            </div>
                            <div className="p-4">
                              <h3 className={`${light("text-black")} ${dark("text-blue-400")} font-bold text-lg mb-1 line-clamp-1`}>
                                {prod.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">{prod.sabor}</Badge>
                                <Badge variant="outline" className="text-xs">{prod.tamano}ml</Badge>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <span className={`${light("text-black")} ${dark("text-blue-400")} text-2xl font-bold`}>
                                  ${prod.precio.toFixed(2)}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-muted-foreground">4.5</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button
                              size="sm"
                              className={`${light("bg-pink-600 hover:bg-pink-500 text-white")} ${dark("bg-blue-600 hover:bg-blue-500 text-white")} flex-1`}
                              onClick={(e) => { e.stopPropagation(); handleComprarDirecto(prod); }}
                            >
                              <CardIcon className="h-4 w-4 mr-2" /> Comprar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`${light("border-pink-600 text-pink-600 hover:bg-pink-50")} ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")} flex-1`}
                              onClick={(e) => { e.stopPropagation(); handleAgregarAlCarrito(prod); }}
                            >
                              <CartIcon className="h-4 w-4 mr-2" /> Al Carrito
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Productos Agotados */}
                {agotados.length > 0 && (
                  <section>
                    <Separator className="my-8" />
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-muted-foreground">Productos Agotados</h2>
                      <Badge variant="secondary" className="text-sm">{agotados.length} productos</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {agotados.map((prod) => (
                        <Card
                          key={prod.id}
                          className={`opacity-60 cursor-not-allowed ${light("bg-white")} ${dark("bg-gray-800")}`}
                        >
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                              {prod.imagenes?.[0] ? (
                                <img
                                  src={prod.imagenes[0].imageUrl || "/placeholder.svg"}
                                  alt={prod.name}
                                  className="w-full h-48 object-cover grayscale" />
                              ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center">
                                  <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                              <Badge variant="destructive" className="absolute top-2 right-2">Agotado</Badge>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-1 line-clamp-1">{prod.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">{prod.sabor}</Badge>
                                <Badge variant="outline" className="text-xs">{prod.tamano}ml</Badge>
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold text-muted-foreground">
                                  ${prod.precio.toFixed(2)}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs text-blue-600">
                                Disponible en {RESTOCK_DAYS} días
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button size="sm" className="flex-1" disabled>
                              <CardIcon className="h-4 w-4 mr-2" /> Comprar
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent" disabled>
                              <CartIcon className="h-4 w-4 mr-2" /> Al Carrito
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Sin resultados */}
                {productosFiltrados.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                    <p className="text-muted-foreground mb-4">Intenta ajustar tus filtros de búsqueda</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBusquedaGeneral("");
                        setFiltroFlavor("Todos los sabores");
                        setFiltroSize("Todos los tamaños");
                        setFiltroPrecioMin("");
                        setFiltroPrecioMax("");
                      }}
                      className={`${light("border-pink-600 text-pink-600 hover:bg-pink-50")} ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")}`}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

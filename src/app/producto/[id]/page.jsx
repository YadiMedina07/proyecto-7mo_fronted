"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";
import { CONFIGURACIONES } from "../../config/config";
import Breadcrumbs from "../../../components/Breadcrumbs";
import {
  ShoppingCart as CartIcon,
  CreditCard as CardIcon,
  Star,
  Package,
  Droplets,
  Ruler,
  Calendar,
  User,
  AlertCircle,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ProductoDetailPage() {
  const { theme } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  // theme helpers
  const light = (s) => theme === "light" ? s : "";
  const dark  = (s) => theme === "dark"  ? s : "";

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${id}`);
        const raw = await res.text();
        const data = JSON.parse(raw);
        setProducto(data.producto ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );

  const averageRating =
    producto?.review?.length > 0
      ? producto.review.reduce((sum, r) => sum + r.rating, 0) / producto.review.length
      : 0;

  // carrito & compra
  const handleAgregarAlCarrito = async (p) => {
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/carrito/agregar`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: p.id, cantidad: 1 }),
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

  const handleComprarDirecto = async (p) => {
    await handleAgregarAlCarrito(p);
    router.push("/pedidos");
  };

  if (loading) {
    return (
      <div className={`${light("bg-gray-50 text-gray-900")} ${dark("bg-gray-900 text-gray-100")} min-h-screen py-8 pt-36 px-4`}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${light("bg-gray-50 text-gray-900")} ${dark("bg-gray-900 text-gray-100")} min-h-screen py-8 pt-36 px-4`}>
        <div className="container mx-auto max-w-7xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className={`${light("bg-gray-50 text-gray-900")} ${dark("bg-gray-900 text-gray-100")} min-h-screen py-8 pt-36 px-4`}>
      <div className="container mx-auto max-w-7xl">
        <Breadcrumbs
          pages={[
            { name: "Home",    path: "/" },
            { name: "Productos", path: "/producto" },
            { name: producto.name, path: `/producto/${id}` },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galería */}
          <div className="space-y-4">
            <Card className={`${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")} overflow-hidden`}>
              <CardContent className="p-0">
                {producto.imagenes?.[selectedImageIndex] ? (
                  <img
                    src={producto.imagenes[selectedImageIndex].imageUrl || "/placeholder.svg"}
                    alt={producto.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-muted flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
            {producto.imagenes?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {producto.imagenes.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === idx
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={img.imageUrl || "/placeholder.svg"}
                      alt={`${producto.name} ${idx + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{producto.name}</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {producto.review?.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-muted-foreground">
                    ({averageRating.toFixed(1)}) • {producto.review.length} reseñas
                  </span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">{producto.description}</p>

            <div className={`${light("text-pink-600")} ${dark("text-blue-400")} text-4xl font-bold`}>
              ${producto.precio.toFixed(2)}
            </div>

            <Card className={`${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")}`}>
              <CardHeader>
                <CardTitle>Especificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Tamaño:</span>
                  <Badge variant="outline">{producto.tamano} ml</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Sabor:</span>
                  <Badge variant="outline">{producto.sabor}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Stock:</span>
                  <Badge variant={producto.stock > 0 ? "default" : "destructive"}>
                    {producto.stock > 0 ? "Disponible" : "Agotado"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className={`${light("bg-pink-600 hover:bg-pink-500 text-white")} ${dark("bg-blue-600 hover:bg-blue-500 text-white")} flex-1`}
                  onClick={() => handleComprarDirecto(producto)}
                  disabled={producto.stock === 0}
                >
                  <CardIcon className="h-5 w-5 mr-2" /> Comprar Ahora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`${light("border-pink-600 text-pink-600 hover:bg-pink-50")} ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")} flex-1`}
                  onClick={() => handleAgregarAlCarrito(producto)}
                  disabled={producto.stock === 0}
                >
                  <CartIcon className="h-5 w-5 mr-2" /> Agregar al Carrito
                </Button>
              </div>
              {producto.stock === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Este producto está temporalmente agotado
                </p>
              )}
            </div>

            <Card className={`${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")}`}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Envío gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Garantía incluida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                    <span>Devolución fácil</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reseñas */}
        <Card className={`${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")}`}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl">Reseñas de Clientes</CardTitle>
            {producto.review?.length > 0 && (
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating))}
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({producto.review.length})</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {producto.review?.length > 0 ? (
              producto.review.map((r, i) => (
                <div key={r.id} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?text=${r.usuario.name.charAt(0)}`} />
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{r.usuario.name}</p>
                          <div className="flex items-center gap-2">
                            {renderStars(r.rating)}
                            <span className="text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{r.comment}</p>
                      {r.images?.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {r.images.map((img) => (
                            <img
                              key={img.id}
                              src={img.url || "/placeholder.svg"}
                              alt=""
                              className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {i < producto.review.length - 1 && <Separator className="mt-6" />}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aún no hay reseñas</h3>
                <p className="text-muted-foreground">Sé el primero en compartir tu opinión.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

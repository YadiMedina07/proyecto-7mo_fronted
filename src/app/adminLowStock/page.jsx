"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import Breadcrumbs from "../../components/Breadcrumbs"
import { CONFIGURACIONES } from "../config/config"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  Package,
  Edit,
  ImageIcon,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Hash,
  RefreshCw,
} from "lucide-react"

export default function LowStockPage() {
  const { theme } = useAuth()
  const router = useRouter()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [updateForm, setUpdateForm] = useState({
    stock: "",
  })
  const [updateIsLoading, setUpdateIsLoading] = useState(false)

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/low-stock`, { credentials: "include" })
        if (!res.ok) throw new Error("Error al cargar productos de bajo stock")
        const { productos } = await res.json()
        setProductos(productos)
      } catch (e) {
        console.error(e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLowStock()
  }, [])

  // Función para abrir el modal de edición del stock
  const handleStockUpdate = (product) => {
    setSelectedProduct(product)
    setUpdateForm({ stock: product.stock }) // Inicializamos con el stock actual
    setShowModal(true)
  }

  // Manejo de cambios en el formulario del modal
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target
    setUpdateForm((prev) => ({ ...prev, [name]: value }))
  }

  // Función para enviar la actualización del stock al backend
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setUpdateIsLoading(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${selectedProduct.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: updateForm.stock }), // Enviamos solo el stock
      })
      if (response.ok) {
        const updatedProduct = await response.json()
        setProductos((prevProducts) =>
          prevProducts.map((product) =>
            product.id === selectedProduct.id ? { ...product, stock: updatedProduct.product.stock } : product,
          ),
        )
        setShowModal(false)
      } else {
        setError("Error al actualizar el stock.")
      }
    } catch (error) {
      console.error(error)
      setError("Error al actualizar el stock.")
    } finally {
      setUpdateIsLoading(false)
    }
  }

  // Función para obtener el estado del stock
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Agotado", variant: "destructive", color: "text-red-600" }
    if (stock <= 1) return { label: "Crítico", variant: "destructive", color: "text-red-600" }
    if (stock <= 3) return { label: "Bajo", variant: "secondary", color: "text-yellow-600" }
    return { label: "Normal", variant: "default", color: "text-green-600" }
  }

  // Función para recargar datos
  const handleRefresh = () => {
    setLoading(true)
    setError("")
    const fetchLowStock = async () => {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/low-stock`, { credentials: "include" })
        if (!res.ok) throw new Error("Error al cargar productos de bajo stock")
        const { productos } = await res.json()
        setProductos(productos)
      } catch (e) {
        console.error(e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLowStock()
  }

  // Estadísticas de stock
  const stats = {
    total: productos.length,
    critical: productos.filter((p) => p.stock <= 1).length,
    low: productos.filter((p) => p.stock > 1 && p.stock <= 3).length,
    outOfStock: productos.filter((p) => p.stock === 0).length,
  }

  return (
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <Breadcrumbs
          pages={[
            { name: "Home", path: "/" },
            { name: "Admin", path: "/admin" },
            { name: "Bajo Stock", path: "/admin/low-stock" },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Productos con Stock Bajo</h1>
                <p className="text-muted-foreground">Productos con stock ≤ 3 unidades</p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>

        </div>

        {/* Mensajes de error */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Contenido principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-pink-600" />
              Lista de Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : productos.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">¡Excelente!</h3>
                <p className="text-muted-foreground">Ningún producto está con stock bajo en este momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">
                        <Hash className="h-4 w-4" />
                      </TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productos.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">#{p.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {p.imagenes?.[0] ? (
                              <img
                                src={p.imagenes[0].imageUrl || "/placeholder.svg"}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {p.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-lg font-bold ${getStockStatus(p.stock).color}`}>{p.stock}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStockStatus(p.stock).variant}>{getStockStatus(p.stock).label}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            onClick={() => handleStockUpdate(p)}
                            size="sm"
                            className="flex-1 bg-pink-500 hover:bg-pink-400 text-white flex items-center justify-center gap-2"

                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de actualización del stock */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Stock del Producto
              </DialogTitle>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4">
                {/* Información del producto */}
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  {selectedProduct.imagenes?.[0] ? (
                    <img
                      src={selectedProduct.imagenes[0].imageUrl || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground">Stock actual: {selectedProduct.stock}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Nuevo Stock
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={updateForm.stock}
                      onChange={handleUpdateFormChange}
                      placeholder="Ingresa la nueva cantidad"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Ingresa la cantidad actualizada de stock para este producto
                    </p>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      className="flex-1 border-pink-600 text-pink-600 hover:bg-pink-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateIsLoading}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      {updateIsLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

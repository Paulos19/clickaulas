"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, UserPlus, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao registrar")
      }

      // Sucesso visual antes do redirect
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      {/* Background Animado (Aurora) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-purple-400/30 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-primary/30 blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="border-white/20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Barra de progresso decorativa no topo */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-purple-500/50 to-primary/20" />

          <CardHeader className="space-y-2 text-center pb-6">
            <motion.div 
              initial={{ rotate: -10, scale: 0 }} 
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30 ring-4 ring-white/50 dark:ring-white/10"
            >
              {success ? <CheckCircle2 className="h-7 w-7 text-white animate-bounce" /> : <UserPlus className="h-7 w-7 text-white" />}
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Crie sua Conta
            </CardTitle>
            <CardDescription className="text-base">
              Comece a gerenciar suas aulas hoje mesmo
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Feedback de Erro */}
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-600">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Feedback de Sucesso */}
            {success ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-2"
              >
                <h3 className="text-xl font-bold text-primary">Cadastro realizado!</h3>
                <p className="text-muted-foreground">Redirecionando para o login...</p>
                <Loader2 className="h-8 w-8 text-primary animate-spin mt-4" />
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Ana Souza" 
                            className="bg-white/50 border-primary/10 focus:border-primary/50 focus:bg-white/80 transition-all h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Corporativo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="voce@escola.com" 
                            className="bg-white/50 border-primary/10 focus:border-primary/50 focus:bg-white/80 transition-all h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Segura</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="No mínimo 6 caracteres" 
                            className="bg-white/50 border-primary/10 focus:border-primary/50 focus:bg-white/80 transition-all h-10"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] mt-2 font-semibold text-md" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Confirmar Cadastro"}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="justify-center bg-white/30 dark:bg-black/20 py-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Já possui uma conta? <Link href="/login" className="font-semibold text-primary hover:text-purple-600 transition-colors underline decoration-primary/30 underline-offset-4">Fazer Login</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
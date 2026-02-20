export function gerarCodigoPedido() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numeros = '0123456789'
  
    const gerarLetras = (quantidade: number) =>
      Array.from({ length: quantidade }, () =>
        letras.charAt(Math.floor(Math.random() * letras.length))
      ).join('')
  
    const gerarNumeros = (quantidade: number) =>
      Array.from({ length: quantidade }, () =>
        numeros.charAt(Math.floor(Math.random() * numeros.length))
      ).join('')
  
    return `VLO-${gerarLetras(4)}${gerarNumeros(2)}`
}
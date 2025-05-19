export const fetchProducts = async () => {
  const response = await fetch('https://dummyjson.com/products')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

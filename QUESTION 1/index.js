

// GET /categories/:category/products
app.get('/categories/:category/products', async (req, res) => {
    const { category } = req.params;
    const { n = 10, page = 1, minPrice = 0, maxPrice = 10000, sortBy = 'price', order = 'asc' } = req.query;
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];

    let allProducts = [];
    for (const company of companies) {
        const products = await fetchTopProducts(company, category, minPrice, maxPrice);
        const uniqueProducts = generateUniqueProducts(products);
        allProducts = allProducts.concat(uniqueProducts);
    }

    // Sorting
    allProducts.sort((a, b) => {
        if (order === 'asc') {
            return a[sortBy] - b[sortBy];
        } else {
            return b[sortBy] - a[sortBy];
        }
    });

    // Pagination
    const start = (page - 1) * n;
    const paginatedProducts = allProducts.slice(start, start + n);

    res.json(paginatedProducts);
});

// GET /categories/:category/products/:productId
app.get('/categories/:category/products/:productId', async (req, res) => {
    const { category, productId } = req.params;
    const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];

    for (const company of companies) {
        const products = await fetchTopProducts(company, category, 0, 10000);
        const uniqueProducts = generateUniqueProducts(products);
        const product = uniqueProducts.find(p => p.id === productId);
        if (product) {
            return res.json(product);
        }
    }

    res.status(404).json({ message: 'Product not found' });
});

app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});

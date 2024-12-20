

export function Newsletter() {
    return (
        <section className="bg-blue-100 py-12">
            <div className="container mx-auto text-center">
                <h2 className="text-xl font-semibold mb-4">Assine nossa Newsletter</h2>
                <p className="text-gray-600 mb-6">Receba as últimas notícias direto no seu email!</p>
                <form className="flex justify-center gap-4">
                    <input
                        type="email"
                        placeholder="Seu email"
                        className="p-3 w-1/2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button type="submit" className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Inscrever-se
                    </button>
                </form>
            </div>
        </section>
    )
}
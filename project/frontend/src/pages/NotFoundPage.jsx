import React from 'react';
import tuninho from '../assets/placeholder-404.png'; 
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#FFF9F9] text-center p-8">
      <img
        src={tuninho} 
        alt="Gato confuso - Página não encontrada"
        className="w-64 h-auto mb-8"
      />

      {/* Texto "404" */}
      <h1 className="text-9xl font-bold text-[#AF204E] mb-4">
        404
      </h1>

      {/* Texto descritivo - Cor #0F1108 */}
      <p className="text-3xl font-normal text-[#0F1108] mb-8">
        não há nada para ouvirmos aqui (infelizmente)
      </p>

      {/* Opcional: Um link para voltar para a Home */}
      <a
        href="/"
        className="text-[#AF204E] hover:underline text-xl font-semibold transition-colors duration-300"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}

export default NotFoundPage;
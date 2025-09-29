import dados from "./../models/dados.js";
const { bruxos } = dados;

const getAllBruxos = (req,res) => {
    const resultado = bruxos;

    res.status(200).json({
        status: 200,
        sucess: true,
        message: "Lista de bruxos convocada com sucesso",
        total: resultado.length,
        bruxos: resultado,
    })
}

const getBruxoById = (req,res) => {
    let id = parseInt(req.params.id);

    const bruxo = bruxos.find(b => b.id === id);

    if (bruxo) {
        res.status(200).json({
        status: 200,
        success: true,
        message: "Bruxo por ID encontrado",
        bruxo: bruxo
      })
      } else {
        res.status(404).json({
          status: 404,
          success: false,
          message: "Nenhum bruxo foi encontrado no beco diagonal",
          error: "WIZARD_NOT_FOUND",
          suggestions: [
            "Check the wizard id"
          ]
        });
      }
    };

const createBruxo = (req,res) => {
    const { nome, casa, anoNascimento, especialidade, nivelMagia, ativo} = req.body

//Se eu quiser fazer validações do tipo, casa obrigatório ou qualquer outro atributo
if (!nome || !casa) {
   return res.status(400).json({
        "status": 400,
        "success": false,
        "message": "Feitiço mal executado! Verifique os ingredientes.",
        "error": "OBRIGATORY_ELEMENTS",
        "details": {
          "casa": "casa selection is required",
          "nome": "nome selection is required"
      }
   });
}

const existeNome = bruxos.some((b) => b.nome.toLowerCase() === nome.toLowerCase()
);

if (existeNome) {
    return res.status(409).json({
    status: 409,
    success: false,
    message: "Já existe um bruxo com esse nome!",
    error: "DUPLICATE_WIZARD",
    suggestions: [
        "Check the wizard nome",
    ]
    })
}


//Depois que validar,posso criar o meu bruxo usando uma const, e adicionar dentro do array.

const novoBruxo = {
    id: bruxos.length + 1,
    nome: nome,
    casa: casa,
    anoNascimento: anoNascimento,
    especialidade: especialidade,
    nivelMagia: nivelMagia,
    ativo: ativo
}

//Push no array
bruxos.push(novoBruxo);

res.status(201).json({
    status: 201,
    sucess: true,
    message: "Novo bruxo matriculado em Hogwarts!",
    bruxo: novoBruxo
})
}

//NEW
//Deletar um bruxo.

const deleteBruxo = (req, res) => {
    const { id } = req.params;
  
    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID deve ser um número válido!",
      });
    }
  
   const { admin } = req.body

   if (admin === false) {
    return res.status(403).json({
        status: 403,
        success: false,
        message: "Somente o Diretor pode executar essa magia!",
        error: "FORBIDDEN_ACTION",
        required_role: "Diretor"
    })
   }
  
    const idParaApagar = parseInt(id);
  
    // Verificar se bruxo existe antes de remover
    const bruxoParaRemover = bruxos.find((b) => b.id === idParaApagar);
    if (!bruxoParaRemover) {
      return res.status(404).json({
        success: false,
        message: `Esse bruxo não existe, ${id}`
      });
    }
  
  
  
    // Remover bruxo usando filter
    const bruxosFiltrados = bruxos.filter((bruxo) => bruxo.id !== idParaApagar);
  
    // Atualizar array global
    bruxos.splice(0, bruxos.length, ...bruxosFiltrados);
  
    res.status(200).json({
      status: 200,
      success: true,
      message: "Bruxo expulso de Hogwarts com sucesso!",
      bruxoRemovido: bruxoParaRemover
    });
  };

  const updateBruxo = (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, casa, anoNascimento, especialidade, nivelMagia, ativo } =
      req.body;
  
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "O id deve ser válido",
      });
    }
  
    const bruxoExiste = bruxos.find((b) => b.id === id);
  
    if (!bruxoExiste) {
      return res.status(404).json({
    status: 404,
    success: false,
    message: "Não é possível reparar o que não existe!",
    error: "WIZARD_NOT_FOUND",
    suggestions: [
        "Check the ID of the wizard"
    ],
      });
    }
  
    const bruxosAtualizados = bruxos.map((b) =>
      b.id === id
        ? {
            ...b,
            ...(nome && {
              nome,
            }),
            ...(casa && {
              casa,
            }),
            ...(anoNascimento && {
              anoNascimento,
            }),
            ...(especialidade && {
              especialidade,
            }),
            ...(nivelMagia && {
              nivelMagia,
            }),
            ...(ativo && {
              ativo,
            }),
          }
        : b
    );
  
    bruxos.splice(0, bruxos.length, ...bruxosAtualizados);
  
    const bruxoAtualizado = bruxos.find((p) => p.id === id);
  
    res.status(200).json({
      status: 200,
      success: true,
      message: "Bruxo atualizado com sucesso",
      bruxoAtualizado: bruxoAtualizado
    });
  };

export { getAllBruxos, getBruxoById, createBruxo, deleteBruxo, updateBruxo};
<!--
  Universal AI Engine Enforcement Rule
-->
# AI Engine Policy: Strict NVIDIA Nemotron Routing Only

## 🚫 BANNED ENGINES
- All non-NVIDIA engines (e.g., Gemini, OpenAI, Claude, Anthropic, generic Antigravity fallbacks) are **STRICTLY PROHIBITED** from direct API invocations or sub-task execution.

## ⚡ MANDATORY NVIDIA ENGINE PROTOCOL
All external AI inference, reasoning, code generation, RAG, and embeddings across this project **MUST EXCLUSIVELY** use the NVIDIA ecosystem via the `ai-gateway` MCP server:
- **OpenRouter AI Gateway**: `query_openrouter`
- **NVIDIA Integrate API**: `query_nvidia_nim`
- **NVIDIA Embeddings**: `generate_nemotron_embedding`

## 🎯 DYNAMIC MODEL SELECTION BY WORKLOAD
Always select the optimal NVIDIA Nemotron engine for the task:
1. **Complex Architecture, Deep Planning & System Refactoring**:
   - `nvidia/nemotron-3-ultra-550b-a55b:free` (550B MoE, 1M context)
2. **Core Software Engineering, Logic Implementation & Code Generation**:
   - `nvidia/nemotron-3-super-120b-a12b:free` (120B MoE, 1M context)
3. **High-Speed Iterations, Scripts & Boilerplate**:
   - `nvidia/nemotron-3.5-lightning:free` (30B MoE, fast response)
4. **Multimodal, Visual UI & Rapid Extended Reasoning**:
   - `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` (30B-A3B MoE, 256K context)
5. **Embeddings, Semantic Search & Vector Retrieval**:
   - `nvidia/nemotron-3-embed-1b:free` (1B embedding)
6. **Multimodal Reranking & UI Verification**:
   - `nvidia/llama-nemotron-rerank-vl-1b-v2:free`

## 🛰️ EXECUTION STATUS BANNER
Every AI-assisted response or generated artifact must include the status banner:
`⚡ NVIDIA Engine Active: <Model Name> | Provider: <NVIDIA Integrate API / OpenRouter AI Gateway>`

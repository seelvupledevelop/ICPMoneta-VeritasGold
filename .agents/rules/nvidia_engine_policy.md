---
trigger: always_on
description: Mandatory project rule enforcing exclusive NVIDIA Nemotron AI engine usage and banning all other models.
---

# NVIDIA Nemotron Engine Enforcement

1. **Exclusivity**: Only NVIDIA engines are permitted. All Gemini, OpenAI, Anthropic, or other third-party models are strictly banned.
2. **Access Methods**: Use the `ai-gateway` MCP tools:
   - `query_openrouter` with NVIDIA model identifiers (`nvidia/nemotron-3-ultra-550b-a55b:free`, `nvidia/nemotron-3-super-120b-a12b:free`, `nvidia/nemotron-3.5-lightning:free`, `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`, etc.)
   - `query_nvidia_nim` for official NVIDIA Integrate API
   - `generate_nemotron_embedding` for embeddings
3. **Model Selection**:
   - `nvidia/nemotron-3-ultra-550b-a55b:free`: Architecture, deep planning, complex reasoning.
   - `nvidia/nemotron-3-super-120b-a12b:free`: Core software engineering, coding, debugging.
   - `nvidia/nemotron-3.5-lightning:free`: Rapid scripts, lightweight tools, fast iterations.
   - `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`: Multimodal reasoning and UI analysis.
4. **Mandatory Header**: Prepend or include the banner:
   `⚡ NVIDIA Engine Active: <Model Name> | Provider: <NVIDIA Integrate API / OpenRouter AI Gateway>`

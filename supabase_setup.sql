-- Habilitar a extensão "uuid-ossp" caso precise gerar UUIDs manuais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Categorias (Tipologias e Tags)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('tipologia', 'tag')),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#cccccc',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Permissões (Roles)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir permissões iniciais básicas
INSERT INTO public.roles (name, permissions) VALUES 
('Admin', '{"usuarios": ["acessar", "ver", "editar", "desativar", "apagar"], "permissoes": ["acessar", "ver", "editar", "desativar", "apagar"], "participantes": ["acessar", "ver", "editar", "desativar", "apagar"], "categorias": ["acessar", "ver", "editar", "desativar", "apagar"], "logs": ["acessar"]}')
ON CONFLICT (name) DO NOTHING;

-- 3. Perfil de Usuários (Estendendo a tabela nativa auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Participantes do Sorteio
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    personal_name VARCHAR(255) NOT NULL,
    establishment_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    tag_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REGRAS DE SEGURANÇA (RLS - Row Level Security)
-- Por enquanto, habilitamos RLS mas permitimos acesso total para autenticados 
-- (Você pode restringir as policies depois conforme o perfil)

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.categories FOR ALL TO authenticated USING (true);
-- Permitir anonimos inserirem (se houver forms públicos) ou lerem
CREATE POLICY "Enable read for anon" ON public.categories FOR SELECT TO anon USING (true);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.roles FOR ALL TO authenticated USING (true);

ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.users_profiles FOR ALL TO authenticated USING (true);

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.participants FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable insert for anon" ON public.participants FOR INSERT TO anon WITH CHECK (true);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.logs FOR ALL TO authenticated USING (true);

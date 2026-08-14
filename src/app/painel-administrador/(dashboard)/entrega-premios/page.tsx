import React from 'react';
import PrizeDeliveryComponent from '@/components/admin/PrizeDeliveryComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrega de Prêmios | Arcofoods Admin',
  description: 'Gerenciamento unificado de prêmios e brindes dos jogos',
};

export default function EntregaPremiosPage() {
  return <PrizeDeliveryComponent />;
}

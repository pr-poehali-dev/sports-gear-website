import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface SizeRecommendation {
  weaponType: string;
  recommendedLength: string;
  explanation: string;
  alternatives?: string[];
}

interface WushuSizeCalculatorProps {
  weaponType: 'sword' | 'staff' | 'spear' | 'dao';
  onSizeRecommended?: (recommendation: SizeRecommendation) => void;
}

const WushuSizeCalculator = ({ weaponType, onSizeRecommended }: WushuSizeCalculatorProps) => {
  const [height, setHeight] = useState<string>('');
  const [armSpan, setArmSpan] = useState<string>('');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);

  const weaponInfo = {
    sword: {
      name: 'Меч Цзянь / Сабля Дао',
      description: 'Длина меча должна быть от подмышки до земли, когда рука вытянута вниз',
      icon: 'Sword',
      measurements: ['рост', 'размах рук']
    },
    staff: {
      name: 'Шест Гунь',
      description: 'Длина шеста обычно равна росту + 10-30см, в зависимости от стиля',
      icon: 'Minus',
      measurements: ['рост']
    },
    spear: {
      name: 'Копье Цян',
      description: 'Длина копья должна быть в 1.3-1.5 раза больше роста спортсмена',
      icon: 'Navigation',
      measurements: ['рост']
    },
    dao: {
      name: 'Сабля Дао',
      description: 'Длина сабли от середины груди до земли при вытянутой руке',
      icon: 'Zap',
      measurements: ['рост', 'размах рук']
    }
  };

  const calculateSize = () => {
    if (!height) return;

    const heightCm = parseFloat(height);
    const armSpanCm = armSpan ? parseFloat(armSpan) : heightCm * 1.05; // Приблизительный размах рук

    let recommendedLength = '';
    let explanation = '';
    let alternatives: string[] = [];

    switch (weaponType) {
      case 'sword':
        const swordLength = Math.round(heightCm * 0.65);
        recommendedLength = `${swordLength}см`;
        explanation = `Для вашего роста ${heightCm}см оптимальная длина меча ${swordLength}см. Это обеспечит правильную технику и баланс.`;
        alternatives = [`${swordLength - 5}см (для начинающих)`, `${swordLength + 5}см (для продвинутых)`];
        break;

      case 'staff':
        let staffLength;
        if (experience === 'beginner') {
          staffLength = Math.round(heightCm + 10);
        } else if (experience === 'intermediate') {
          staffLength = Math.round(heightCm + 20);
        } else {
          staffLength = Math.round(heightCm + 30);
        }
        recommendedLength = `${staffLength}см`;
        explanation = `Для роста ${heightCm}см и уровня "${experience}" рекомендуется шест ${staffLength}см.`;
        alternatives = ['1.8м (стандарт)', '2.0м (высокий)', '1.6м (детский)'];
        break;

      case 'spear':
        const spearLength = Math.round(heightCm * 1.4);
        recommendedLength = `${spearLength}см`;
        explanation = `Для роста ${heightCm}см оптимальная длина копья ${spearLength}см (в 1.4 раза больше роста).`;
        alternatives = [`${Math.round(heightCm * 1.3)}см (короткое)`, `${Math.round(heightCm * 1.5)}см (длинное)`];
        break;

      case 'dao':
        const daoLength = Math.round(heightCm * 0.68);
        recommendedLength = `${daoLength}см`;
        explanation = `Для вашего роста ${heightCm}см оптимальная длина сабли ${daoLength}см.`;
        alternatives = [`${daoLength - 3}см (легкая)`, `${daoLength + 3}см (тяжелая)`];
        break;
    }

    const newRecommendation: SizeRecommendation = {
      weaponType: weaponInfo[weaponType].name,
      recommendedLength,
      explanation,
      alternatives
    };

    setRecommendation(newRecommendation);
    onSizeRecommended?.(newRecommendation);
  };

  const resetCalculator = () => {
    setHeight('');
    setArmSpan('');
    setExperience('beginner');
    setRecommendation(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon name={weaponInfo[weaponType].icon} className="h-5 w-5 text-primary" />
          <span>Калькулятор размера</span>
        </CardTitle>
        <p className="text-sm text-foreground/70">{weaponInfo[weaponType].name}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-foreground/80 p-3 bg-muted/50 rounded-lg">
          <Icon name="Info" className="h-4 w-4 inline mr-2" />
          {weaponInfo[weaponType].description}
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="height">Рост (см) *</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1"
            />
          </div>

          {weaponInfo[weaponType].measurements.includes('размах рук') && (
            <div>
              <Label htmlFor="armSpan">Размах рук (см)</Label>
              <Input
                id="armSpan"
                type="number"
                placeholder="175"
                value={armSpan}
                onChange={(e) => setArmSpan(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-foreground/60 mt-1">
                Необязательно. Если не указан, будет рассчитан автоматически.
              </p>
            </div>
          )}

          {(weaponType === 'staff' || weaponType === 'spear') && (
            <div>
              <Label>Уровень подготовки</Label>
              <div className="flex space-x-2 mt-2">
                {[
                  { key: 'beginner', label: 'Начинающий' },
                  { key: 'intermediate', label: 'Средний' },
                  { key: 'advanced', label: 'Продвинутый' }
                ].map((level) => (
                  <Button
                    key={level.key}
                    variant={experience === level.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExperience(level.key as any)}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={calculateSize} 
            disabled={!height}
            className="flex-1"
          >
            <Icon name="Calculator" className="mr-2 h-4 w-4" />
            Рассчитать
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            <Icon name="RefreshCw" className="h-4 w-4" />
          </Button>
        </div>

        {recommendation && (
          <div className="space-y-3 p-4 bg-accent/10 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" className="h-5 w-5 text-accent" />
              <h4 className="font-semibold">Рекомендация</h4>
            </div>
            
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-1">
                {recommendation.recommendedLength}
              </Badge>
            </div>
            
            <p className="text-sm text-foreground/80">
              {recommendation.explanation}
            </p>

            {recommendation.alternatives && recommendation.alternatives.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Альтернативные размеры:</p>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.alternatives.map((alt, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="text-xs text-foreground/60 border-t pt-2">
              <Icon name="AlertTriangle" className="h-3 w-3 inline mr-1" />
              Рекомендация носит справочный характер. Окончательный выбор зависит от индивидуальных предпочтений и стиля.
            </div>
          </div>
        )}

        <div className="text-xs text-foreground/60 space-y-1">
          <div className="flex items-center space-x-1">
            <Icon name="Ruler" className="h-3 w-3" />
            <span>Точные измерения важны для правильной техники</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" className="h-3 w-3" />
            <span>При сомнениях консультируйтесь с тренером</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WushuSizeCalculator;
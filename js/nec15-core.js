/**
 * ========================================================================
 * NEC-15 CORE - Módulo de Cálculos Sísmicos
 * ========================================================================
 * Implementación de todas las fórmulas de la Norma Ecuatoriana de
 * Construcción NEC-15 para calcular espectros sísmicos y fuerzas laterales
 */

const NEC15 = {

    /**
     * Tablas de coeficientes NEC-15
     */
    tablas: {
        // Factor de amplificación Fa
        Fa: {
            'A': [0.90, 0.90, 0.90, 0.90, 0.90, 0.90],
            'B': [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            'C': [1.40, 1.30, 1.25, 1.23, 1.20, 1.18],
            'D': [1.60, 1.40, 1.30, 1.25, 1.20, 1.12],
            'E': [1.80, 1.40, 1.25, 1.10, 1.00, 0.85]
        },
        // Factor de amplificación Fd
        Fd: {
            'A': [0.90, 0.90, 0.90, 0.90, 0.90, 0.90],
            'B': [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
            'C': [1.36, 1.28, 1.19, 1.15, 1.11, 1.06],
            'D': [1.62, 1.45, 1.36, 1.28, 1.19, 1.11],
            'E': [2.10, 1.75, 1.70, 1.65, 1.60, 1.50]
        },
        // Factor de comportamiento Fs
        Fs: {
            'A': [0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
            'B': [0.75, 0.75, 0.75, 0.75, 0.75, 0.75],
            'C': [0.85, 0.94, 1.02, 1.06, 1.11, 1.23],
            'D': [1.02, 1.06, 1.11, 1.19, 1.28, 1.40],
            'E': [1.50, 1.60, 1.70, 1.80, 1.90, 2.00]
        }
    },

    /**
     * Obtener factor Z según zona sísmica
     */
    getZ: function (zona) {
        const valores = {
            'I': 0.15,
            'II': 0.25,
            'III': 0.30,
            'IV': 0.35,
            'V': 0.40,
            'VI': 0.50
        };
        return valores[zona] || 0.40;
    },

    /**
     * Obtener índice de columna según zona (para tablas)
     */
    getColumnaZona: function (zona) {
        const indices = {
            'I': 0, 'II': 1, 'III': 2,
            'IV': 3, 'V': 4, 'VI': 5
        };
        return indices[zona] || 4;
    },

    /**
     * Obtener factor eta según región
     */
    getEta: function (region) {
        const valores = {
            'Sierra': 2.48,
            'Esmeraldas': 2.48,
            'Galapagos': 2.48,
            'Costa': 1.80,
            'Oriente': 2.60
        };
        return valores[region] || 2.48;
    },

    /**
     * Obtener exponente r según tipo de suelo
     */
    getR: function (suelo) {
        return suelo === 'E' ? 1.5 : 1.0;
    },

    /**
     * Obtener coeficientes cu y alfa según sistema estructural
     */
    getSistemaCoeficientes: function (sistema) {
        const sistemas = {
            'porticos_ha': { cu: 0.055, alfa: 0.90 },
            'muros_ha': { cu: 0.048, alfa: 0.90 },
            'porticos_acero': { cu: 0.072, alfa: 0.80 },
            'arriostrado_acero': { cu: 0.060, alfa: 0.80 },
            'mixto': { cu: 0.050, alfa: 0.90 }
        };
        return sistemas[sistema] || sistemas['porticos_ha'];
    },

    /**
     * Calcular espectro de respuesta elástico NEC-15
     * Retorna objeto con vectores T y Sa
     */
    calcularEspectro: function (zona, suelo, region) {
        const Z = this.getZ(zona);
        const col = this.getColumnaZona(zona);
        const Fa = this.tablas.Fa[suelo][col];
        const Fd = this.tablas.Fd[suelo][col];
        const Fs = this.tablas.Fs[suelo][col];
        const eta = this.getEta(region);
        const r = this.getR(suelo);

        // Parámetros del espectro
        const Sa0 = Z * Fa;
        const T0 = 0.1 * (Fs * Fd / Fa);
        const Tc = 0.55 * (Fs * Fd / Fa);

        // Generar espectro para rango de periodos
        const periodos = [];
        const aceleraciones = [];

        // Rango: 0 a 4 segundos con paso de 0.01
        for (let T = 0; T <= 4; T += 0.01) {
            periodos.push(T);

            let Sa;
            if (T === 0) {
                Sa = Sa0;
            } else if (T <= T0) {
                // Tramo ascendente
                Sa = Z * Fa * (1 + (eta - 1) * T / T0);
            } else if (T <= Tc) {
                // Meseta
                Sa = eta * Z * Fa;
            } else {
                // Descendente hiperbólico
                Sa = eta * Z * Fa * Math.pow(Tc / T, r);
            }
            aceleraciones.push(Sa);
        }

        return {
            T: periodos,
            Sa: aceleraciones,
            parametros: {
                Z, Fa, Fd, Fs, eta, r, Sa0, T0, Tc
            }
        };
    },

    /**
     * Calcular periodo fundamental (método empírico)
     */
    calcularPeriodoFundamental: function (hn, sistema) {
        const { cu, alfa } = this.getSistemaCoeficientes(sistema);
        const T1 = cu * Math.pow(hn, alfa);
        return T1;
    },

    /**
     * Obtener aceleración espectral para un periodo específico
     */
    obtenerSa: function (T, zona, suelo, region) {
        const espectro = this.calcularEspectro(zona, suelo, region);
        // Encontrar el índice más cercano
        let idx = Math.round(T / 0.01);
        idx = Math.max(0, Math.min(idx, espectro.Sa.length - 1));
        return {
            Sa: espectro.Sa[idx],
            parametros: espectro.parametros
        };
    },

    /**
     * Calcular coeficiente sísmico
     */
    calcularCoeficienteSismico: function (Sa, I, R, fiP, fiE) {
        const f = I / (R * fiP * fiE);
        const C = Sa * f;
        return { C, f };
    },

    /**
     * Verificar cortante mínimo
     */
    verificarCortanteMinimo: function (C, Z, I) {
        const C_min = 0.16 * Z * I;
        const cumple = C >= C_min;
        const C_final = cumple ? C : C_min;
        return {
            C: C_final,
            C_min,
            cumple,
            mensaje: cumple ? 'C ≥ C_min ✓' : '⚠️ C < C_min, usando C_min'
        };
    },

    /**
     * Calcular cortante basal
     */
    calcularCortanteBasal: function (C, W) {
        return C * W;
    },

    /**
     * Calcular exponente k para distribución de fuerzas
     */
    calcularExponenteK: function (T1) {
        if (T1 <= 0.5) {
            return 1.0;
        } else if (T1 <= 2.5) {
            return 0.75 + 0.5 * T1;
        } else {
            return 2.0;
        }
    },

    /**
     * Distribuir fuerzas laterales por nivel
     */
    distribuirFuerzas: function (pesos, alturas, V, T1) {
        const k = this.calcularExponenteK(T1);
        const n = pesos.length;

        // Calcular alturas acumuladas
        let Hi = [];
        let suma = 0;
        for (let i = 0; i < n; i++) {
            suma += alturas[i];
            Hi.push(suma);
        }

        // Calcular Wi * Hi^k para cada nivel
        let WiHik = [];
        let sumaWiHik = 0;
        for (let i = 0; i < n; i++) {
            const valor = pesos[i] * Math.pow(Hi[i], k);
            WiHik.push(valor);
            sumaWiHik += valor;
        }

        // Calcular fuerzas por nivel
        let fuerzas = [];
        for (let i = 0; i < n; i++) {
            const Fi = V * (WiHik[i] / sumaWiHik);
            fuerzas.push(Fi);
        }

        return {
            fuerzas,
            k,
            Hi,
            porcentajes: fuerzas.map(f => (f / V) * 100)
        };
    },

    /**
     * Cálculo completo - Método principal
     */
    calcularCompleto: function (params) {
        const {
            zona, suelo, region,
            nPisos, alturas, pesos,
            sistema, R, I, fiP, fiE
        } = params;

        // 1. Calcular espectro elástico
        const espectro = this.calcularEspectro(zona, suelo, region);

        // 2. Calcular periodo fundamental
        const hn = alturas.reduce((sum, h) => sum + h, 0);
        const T1 = this.calcularPeriodoFundamental(hn, sistema);

        // 3. Obtener Sa(T1)
        const result_Sa = this.obtenerSa(T1, zona, suelo, region);
        const Sa_T1 = result_Sa.Sa;

        // 4. Calcular coeficiente sísmico
        const { C: C_inicial, f } = this.calcularCoeficienteSismico(
            Sa_T1, I, R, fiP, fiE
        );

        // 5. Verificar cortante mínimo
        const Z = this.getZ(zona);
        const cortante = this.verificarCortanteMinimo(C_inicial, Z, I);
        const C = cortante.C;

        // 6. Calcular cortante basal
        const W = pesos.reduce((sum, p) => sum + p, 0);
        const V = this.calcularCortanteBasal(C, W);

        // 7. Distribuir fuerzas laterales
        const distribucion = this.distribuirFuerzas(pesos, alturas, V, T1);

        // 8. Espectro inelástico
        const Sa_inelastico = espectro.Sa.map(sa => sa * f);

        // Retornar todos los resultados
        return {
            // Parámetros de entrada
            entrada: { zona, suelo, region, nPisos, hn, W },

            // Espectros
            espectro: {
                T: espectro.T,
                Sa_elastico: espectro.Sa,
                Sa_inelastico,
                parametros: espectro.parametros
            },

            // Resultados principales
            resultados: {
                T1,
                Sa_T1,
                f,
                C,
                C_inicial,
                C_min: cortante.C_min,
                V,
                W,
                porcentaje_peso: (V / W) * 100
            },

            // Distribución de fuerzas
            distribucion: {
                fuerzas: distribucion.fuerzas,
                Hi: distribucion.Hi,
                k: distribucion.k,
                porcentajes: distribucion.porcentajes
            },

            // Validaciones
            validaciones: {
                cortante_minimo: cortante.cumple,
                mensaje_cortante: cortante.mensaje,
                T1_limite: T1 * 1.3
            }
        };
    }
};

// Exportar para uso global
window.NEC15 = NEC15;

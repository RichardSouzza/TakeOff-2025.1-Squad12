import { useEffect, useState } from 'react';
import Select, { GroupBase, Props } from 'react-select';
import { FaExclamationCircle, FaAsterisk } from 'react-icons/fa';

const colorVariants = {
  red: {
    main: '#600000',
    focusBg: '#600000',
    text: '#600000',
  },
  success: {
    main: '#178545',
    focusBg: '#178545',
    text: '#178545',
  },
  alert: {
    main: '#FFC107',
    focusBg: '#FFC107',
    text: '#946900',
  },
  error: {
    main: '#DC3545',
    focusBg: '#DC3545',
    text: '#DC3545',
  },
  info: {
    main: '#446AB8',
    focusBg: '#446AB8',
    text: '#446AB8',
  },
  gray: {
    main: '#B3B3B3',
    focusBg: '#B3B3B3',
    text: '#000000',
  },
};

interface SelectInputProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> extends Props<Option, IsMulti, Group> {
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
  type?: keyof typeof colorVariants;
}

/**
 * @description SelectInput
 * 
 * @param label Nome da label.
 * @param isRequired Se for verdadeiro o input ficará com a identificação de obrigatório com o "*" vermelho.
 * @param options Opções que serão exibidas no dropdown do Select.
 * Deve ser um array de objetos com as propriedades `value` e `label`.
 * Exemplo: [{ value: 'chocolate', label: 'Chocolate' }]
 * @param isSearchable Controla se o campo será pesquisável. Vem True como padrão.
 * @param type Cor principal do Select.
 * 
 **/
export function SelectInput<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectInputProps<Option, IsMulti, Group>
) {
  const [_document, _setDocument] = useState<any>(null);
  const {
    label,
    isRequired,
    errorMessage,
    type = 'red',
    defaultValue = null,
    ...restProps
  } = props;

  const selectedColors = colorVariants[type];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      _setDocument(document.body);
    }
  }, []);

  return (
    <div className="relative flex flex-col gap-1">
      {!!label && (
        <span
          className={`flex gap-2 absolute px-1 -top-[12px] left-2 bg-white z-10 font-poppins text-sm rounded-full`}
          style={{ color: selectedColors.text }}
        >
          {label}
          {isRequired && (
            <span className="text-[#DC3545] text-[20px]">
              <FaAsterisk className="w-[8px]" />
            </span>
          )}
        </span>
      )}

      {_document && (
        <>
          <Select
            instanceId="wsad123wqwe"
            defaultValue={defaultValue}
            {...restProps}
            noOptionsMessage={() => 'Nenhuma opção encontrada'}
            loadingMessage={() => 'Carregando...'}
            placeholder="Selecione..."
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: selectedColors.focusBg,
                primary: selectedColors.main,
                neutral90: 'FFFFFF',
              },
            })}
            menuPortalTarget={_document}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: errorMessage
                  ? '#DC3545'
                  : state.isFocused
                  ? selectedColors.main
                  : selectedColors.main,
                boxShadow: state.isFocused
                  ? `0 0 0 2px ${selectedColors.main}40`
                  : 'none',
                paddingLeft: '4px',
                paddingRight: '4px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: errorMessage ? '#DC3545' : `${selectedColors.main}`,
                  boxShadow: `0 0 0 2px ${selectedColors.main}40`,
                },
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '4px',
                border: `1px solid ${selectedColors.main}`,
                marginTop: '4px',
                overflow: 'hidden',
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              menuList: (base) => ({
                ...base,
                padding: 0,
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: selectedColors.main,
                '&:hover': {
                  color: selectedColors.main,
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: selectedColors.text,
              }),
              input: (base) => ({
                ...base,
                color: selectedColors.text,
                fontWeight: 500,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? selectedColors.focusBg
                  : 'white',
                color: state.isFocused
                  ? '#FFFFFF'
                  : selectedColors.text,
                '&:hover': {
                  backgroundColor: selectedColors.focusBg,
                  color: '#FFFFFF',
                },
              }),
            }}
          />

          {errorMessage && (
            <div className="flex items-center gap-1 pt-1">
              <FaExclamationCircle className="h-4 w-4 text-red-500" />
              <h2 className="text-xs text-red-500 text-wrap">{errorMessage}</h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}


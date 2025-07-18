import {
  ButtonLink,
  IconInformationRegular,
  skinVars
} from '@telefonica/mistica';
import { TitleProps } from '@telefonica/mistica/dist/title';
import { HeadingType } from '@telefonica/mistica/dist/utils/types';

type RenderTitleComponentProps = {
  title: string;
  linkText: string;
  right: 'link' | 'icon' | 'undefined';
  defaultTitle: string;
  as: HeadingType;
  TitleComponent: React.ComponentType<TitleProps>;
};
const TitleComponent = ({
  title,

  defaultTitle,
  as,
  TitleComponent
}: RenderTitleComponentProps): JSX.Element => (
  <TitleComponent as={as} dataAttributes={{ testid: defaultTitle }}>
    {title || defaultTitle}
  </TitleComponent>
);
export default TitleComponent;

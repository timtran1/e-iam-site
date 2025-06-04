import Layout from '../../component/layout/index.jsx';
import FormMessage from '../../component/form-message/index.jsx';

const Home = () => {
  return (
    <>
      <Layout>
        <div>
          {[
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas porttitor enim vel ullamcorper. Vivamus ut tempus lorem, ac varius mi. Curabitur at vehicula dolor, sed aliquet libero. Nullam maximus dui vitae ligula fringilla feugiat. Vivamus et consectetur mauris. Nam congue finibus tellus id molestie. ',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas porttitor enim vel ullamcorper. Vivamus ut tempus lorem, ac varius mi. Curabitur at vehicula dolor, sed aliquet libero. Nullam maximus dui vitae ligula fringilla feugiat. Vivamus et consectetur mauris. Nam congue finibus tellus id molestie. ',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas porttitor enim vel ullamcorper. Vivamus ut tempus lorem, ac varius mi. Curabitur at vehicula dolor, sed aliquet libero. Nullam maximus dui vitae ligula fringilla feugiat. Vivamus et consectetur mauris. Nam congue finibus tellus id molestie. ',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas porttitor enim vel ullamcorper. Vivamus ut tempus lorem, ac varius mi. Curabitur at vehicula dolor, sed aliquet libero. Nullam maximus dui vitae ligula fringilla feugiat. Vivamus et consectetur mauris. Nam congue finibus tellus id molestie. ',
          ].join(
            ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras egestas porttitor enim vel ullamcorper. Vivamus ut tempus lorem, ac varius mi. Curabitur at vehicula dolor, sed aliquet libero. Nullam maximus dui vitae ligula fringilla feugiat. Vivamus et consectetur mauris. Nam congue finibus tellus id molestie.  '
          )}

          <FormMessage />
        </div>
      </Layout>
    </>
  );
};

export default Home;

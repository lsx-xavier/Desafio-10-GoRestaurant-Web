import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updatedEdit, setUpdatedEdit] = useState<number>();

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // TODO LOAD FOODS
      await api.get<IFoodPlate[]>('/foods').then(response => {
        setFoods(response.data);
      });
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API

      const createFood = await api.post('/foods', {
        image: food.image,
        name: food.name,
        price: food.price,
        description: food.description,
        available: true,
      });

      setFoods([...foods, createFood.data]);
    } catch (err) {
      throw new Error('Aconteceu um erro!');
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // TODO UPDATE A FOOD PLATE ON THE API

    api
      .put(`/foods/${updatedEdit}`, {
        name: food.name,
        image: food.image,
        price: food.price,
        description: food.description,
      })
      .then(response => {
        const indexArray = foods.findIndex(f => f.id === updatedEdit);

        foods[indexArray] = {
          ...foods[indexArray],
          name: food.name,
          image: food.image,
          price: food.price,
          description: food.description,
        };

        setFoods([...foods]);
      });
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    await api.delete(`/foods/${id}`);
    setFoods(foods.filter(food => food.id !== id));
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    try {
      setUpdatedEdit(food.id);
      setEditingFood(food);
      toggleEditModal();
    } catch (err) {
      throw new Error('Aconteceu um erro no Edit!');
    }
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
